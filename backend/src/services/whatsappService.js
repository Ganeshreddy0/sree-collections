import { ENV } from '../config/env.js';

/**
 * Clean and format phone number for Meta WhatsApp Cloud API.
 * WhatsApp Cloud API expects recipient number without '+' or special characters,
 * prefixed with country code (e.g. 919876543210 for India).
 */
export function formatPhoneNumber(phone) {
  if (!phone) return null;
  // Remove all whitespace, dashes, parens, dots
  let cleaned = phone.toString().replace(/[\s\-\(\)\.]/g, '');

  // Remove leading '+'
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // If starts with 0 (e.g. 09876543210), remove 0 and assume India (+91)
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '91' + cleaned.substring(1);
  }

  // If 10 digits (typical Indian mobile 9876543210), prepend 91
  if (cleaned.length === 10 && /^\d{10}$/.test(cleaned)) {
    cleaned = '91' + cleaned;
  }

  // Validate only digits and standard length (10 to 15 digits)
  if (!/^\d{10,15}$/.test(cleaned)) {
    return null;
  }

  return cleaned;
}

/**
 * Format order items into a concise, readable summary string for WhatsApp message.
 */
export function formatItemsSummary(items = []) {
  if (!items || items.length === 0) return 'Saree(s)';
  return items
    .map((item) => {
      const details = [];
      if (item.colour) details.push(`Colour: ${item.colour}`);
      if (item.size && item.size !== 'Free Size' && item.size !== 'Standard') {
        details.push(`Size: ${item.size}`);
      }
      const detailStr = details.length > 0 ? ` (${details.join(', ')})` : '';
      return `${item.quantity}x ${item.title}${detailStr}`;
    })
    .join(', ');
}

/**
 * Check if Meta WhatsApp Cloud API credentials are configured.
 */
export function isWhatsAppConfigured() {
  return (
    Boolean(ENV.WHATSAPP_API_TOKEN) &&
    Boolean(ENV.WHATSAPP_PHONE_NUMBER_ID) &&
    ENV.WHATSAPP_API_TOKEN !== 'YOUR_META_WHATSAPP_ACCESS_TOKEN' &&
    ENV.WHATSAPP_PHONE_NUMBER_ID !== 'YOUR_PHONE_NUMBER_ID'
  );
}

/**
 * Send WhatsApp Order Confirmation message via Meta WhatsApp Business Platform Cloud API.
 * @param {Object} order - Full Mongoose Order document or plain object
 * @returns {Promise<Object>} { success, status, messageId, error, recipient, sentAt }
 */
export async function sendOrderConfirmation(order) {
  const rawPhone = order.whatsappNumber || order.customerPhone;
  const cleanedPhone = formatPhoneNumber(rawPhone);

  if (!cleanedPhone) {
    return {
      success: false,
      status: 'failed',
      error: `Invalid phone number format: "${rawPhone}". Expected 10-digit mobile or number with country code.`,
      recipient: rawPhone,
      timestamp: new Date(),
    };
  }

  // Check if credentials are configured
  if (!isWhatsAppConfigured()) {
    return {
      success: false,
      status: 'not_configured',
      error:
        'WhatsApp Cloud API credentials (WHATSAPP_API_TOKEN or WHATSAPP_PHONE_NUMBER_ID) are not configured in backend/.env',
      recipient: cleanedPhone,
      timestamp: new Date(),
    };
  }

  const itemsSummary = formatItemsSummary(order.items);
  const formattedTotal = `₹${Number(order.totalAmount || 0).toLocaleString('en-IN')}`;
  const apiUrl = `https://graph.facebook.com/${ENV.WHATSAPP_API_VERSION}/${ENV.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  // 1. Primary Attempt: Official WhatsApp Template Message
  const templatePayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanedPhone,
    type: 'template',
    template: {
      name: ENV.WHATSAPP_TEMPLATE_NAME,
      language: {
        code: ENV.WHATSAPP_TEMPLATE_LANG || 'en',
      },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: String(order.customerName || 'Valued Customer') },
            { type: 'text', text: String(order.orderNumber || '') },
            { type: 'text', text: String(formattedTotal || '') },
          ],
        },
      ],
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ENV.WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templatePayload),
    });

    const data = await response.json();

    if (response.ok && data.messages && data.messages.length > 0) {
      return {
        success: true,
        status: 'sent',
        messageId: data.messages[0].id,
        recipient: cleanedPhone,
        templateName: ENV.WHATSAPP_TEMPLATE_NAME,
        sentAt: new Date(),
      };
    }

    // If template sending failed, check if fallback text is allowed
    const templateError = data.error?.message || JSON.stringify(data.error || data);
    console.warn(`[WhatsApp API] Template send failed: ${templateError}`);

    if (ENV.WHATSAPP_ENABLE_FALLBACK_TEXT) {
      console.log(`[WhatsApp API] Attempting fallback text message for ${cleanedPhone}...`);
      const fallbackResult = await sendFallbackTextMessage(order, cleanedPhone, itemsSummary, formattedTotal);
      if (fallbackResult.success) {
        return fallbackResult;
      }
    }

    return {
      success: false,
      status: 'failed',
      error: `Meta WhatsApp API error: ${templateError}`,
      errorCode: data.error?.code,
      errorSubcode: data.error?.error_subcode,
      recipient: cleanedPhone,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('[WhatsApp API] Network or server error:', error);
    return {
      success: false,
      status: 'failed',
      error: `Failed to connect to Meta WhatsApp API: ${error.message}`,
      recipient: cleanedPhone,
      timestamp: new Date(),
    };
  }
}

/**
 * Fallback session text message when template is pending approval or during 24-hr customer service window.
 */
async function sendFallbackTextMessage(order, cleanedPhone, itemsSummary, formattedTotal) {
  const apiUrl = `https://graph.facebook.com/${ENV.WHATSAPP_API_VERSION}/${ENV.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const itemsList = (order.items || [])
    .map((item, idx) => {
      const colourStr = item.colour ? ` | Colour: ${item.colour}` : '';
      const sizeStr = item.size && item.size !== 'Free Size' ? ` | Size: ${item.size}` : '';
      return `${idx + 1}. *${item.title}*${colourStr}${sizeStr} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`;
    })
    .join('\n');

  const textBody =
    `*🌸 Sree Collections - Order Confirmation*\n\n` +
    `Hello *${order.customerName}*,\n` +
    `Thank you for shopping with Sree Collections! Your saree order has been received and confirmed.\n\n` +
    `*Order ID:* ${order.orderNumber}\n` +
    `*Status:* ${order.orderStatus || 'Confirmed'}\n\n` +
    `*Ordered Items:*\n${itemsList || itemsSummary}\n\n` +
    `*Total Amount:* ${formattedTotal}\n` +
    `*Payment Method:* ${order.paymentMethod || 'COD'}\n\n` +
    `*Delivery Address:*\n` +
    `${order.shippingAddress?.street || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}\n\n` +
    `We will notify you as soon as your package is dispatched! ✨\n` +
    `For any questions, feel free to reply to this chat.`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanedPhone,
    type: 'text',
    text: {
      preview_url: false,
      body: textBody,
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ENV.WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok && data.messages && data.messages.length > 0) {
      return {
        success: true,
        status: 'sent',
        messageId: data.messages[0].id,
        recipient: cleanedPhone,
        isFallbackText: true,
        sentAt: new Date(),
      };
    }

    return {
      success: false,
      status: 'failed',
      error: data.error?.message || 'Fallback text message delivery failed',
      recipient: cleanedPhone,
    };
  } catch (error) {
    return {
      success: false,
      status: 'failed',
      error: `Fallback text network error: ${error.message}`,
      recipient: cleanedPhone,
    };
  }
}

/**
 * Send WhatsApp notification to the Store Owner when a new order is placed.
 * @param {Object} order - Order document
 * @returns {Promise<Object>}
 */
export async function sendOwnerOrderAlert(order) {
  const rawOwnerPhone = ENV.OWNER_WHATSAPP_PHONE || '919948469132';
  const cleanedOwnerPhone = formatPhoneNumber(rawOwnerPhone);

  if (!cleanedOwnerPhone) {
    console.warn('[WhatsApp Owner Alert] Invalid owner phone number:', rawOwnerPhone);
    return { success: false, status: 'failed', error: 'Invalid owner phone number' };
  }

  if (!isWhatsAppConfigured()) {
    console.warn('[WhatsApp Owner Alert] WhatsApp API credentials not configured');
    return { success: false, status: 'not_configured', error: 'WhatsApp not configured' };
  }

  const apiUrl = `https://graph.facebook.com/${ENV.WHATSAPP_API_VERSION}/${ENV.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  // Build the detailed items list and address for follow-up freeform message
  const itemsList = (order.items || [])
    .map(
      (it, idx) =>
        `${idx + 1}. ${it.title}${it.colour ? ' (' + it.colour + ')' : ''}${
          it.size && it.size !== 'Free Size' ? ' [' + it.size + ']' : ''
        } x${it.quantity} = Rs.${it.price * it.quantity}`
    )
    .join('\n');

  const address = order.shippingAddress || {};
  const addressLine = [address.street, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(', ');

  const fullDetailsText =
    `NEW ORDER RECEIVED - Sree Collections\n\n` +
    `Order ID: #${order.orderNumber}\n` +
    `Customer: ${order.customerName}\n` +
    `Phone: +${order.customerPhone}\n` +
    `WhatsApp: +${order.whatsappNumber || order.customerPhone}\n` +
    `Amount: Rs.${Number(order.totalAmount || 0).toLocaleString('en-IN')} (${order.paymentMethod || 'COD'})\n\n` +
    `Items Ordered:\n${itemsList}\n\n` +
    `Delivery Address:\n${address.fullName || order.customerName}\n${addressLine}\n\n` +
    `Placed At: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

  // STEP 1: Send template FIRST (guaranteed delivery — works even outside 24hr window)
  // Pack the most important owner info into the 3 template parameters
  const templatePayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanedOwnerPhone,
    type: 'template',
    template: {
      name: ENV.WHATSAPP_TEMPLATE_NAME,
      language: { code: ENV.WHATSAPP_TEMPLATE_LANG || 'en' },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: `OWNER ALERT - ${String(order.customerName || 'Customer').replace(/[\r\n\t]/g, ' ').trim()}`.slice(0, 60),
            },
            {
              type: 'text',
              text: `#${order.orderNumber} | +${order.customerPhone || ''}`.replace(/[\r\n\t]/g, ' ').trim().slice(0, 60),
            },
            {
              type: 'text',
              text: `Rs.${Number(order.totalAmount || 0).toLocaleString('en-IN')} (${order.paymentMethod || 'COD'}) | ${order.items?.length || 0} item(s)`.replace(/[\r\n\t]/g, ' ').trim().slice(0, 60),
            },
          ],
        },
      ],
    },
  };

  let templateResult = null;
  try {
    const tmplRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ENV.WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templatePayload),
    });
    const tmplData = await tmplRes.json();

    if (tmplRes.ok && tmplData.messages && tmplData.messages.length > 0) {
      console.log(`[WhatsApp Owner Alert] Template alert sent to owner ${cleanedOwnerPhone} - MessageID: ${tmplData.messages[0].id}`);
      templateResult = {
        success: true,
        status: 'sent',
        messageId: tmplData.messages[0].id,
        recipient: cleanedOwnerPhone,
        sentAt: new Date(),
        method: 'template',
      };
    } else {
      console.warn('[WhatsApp Owner Alert] Template failed:', tmplData.error?.message || JSON.stringify(tmplData));
      templateResult = {
        success: false,
        status: 'failed',
        error: tmplData.error?.message || 'Template delivery failed',
        recipient: cleanedOwnerPhone,
      };
    }
  } catch (tmplErr) {
    console.error('[WhatsApp Owner Alert] Template network error:', tmplErr.message);
    templateResult = { success: false, status: 'failed', error: tmplErr.message, recipient: cleanedOwnerPhone };
  }

  // STEP 2: After template (which opens a conversation context), try sending the FULL DETAILS as freeform text
  // This works when the template message opens the conversation or if 24hr window is already open
  if (templateResult.success) {
    // Small delay to allow template to register before follow-up
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const textRes = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ENV.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanedOwnerPhone,
          type: 'text',
          text: { preview_url: false, body: fullDetailsText },
        }),
      });
      const textData = await textRes.json();
      if (textRes.ok && textData.messages && textData.messages.length > 0) {
        console.log(`[WhatsApp Owner Alert] Full details text also sent to owner ${cleanedOwnerPhone}`);
        return {
          ...templateResult,
          fullDetailsSent: true,
          fullDetailsMessageId: textData.messages[0].id,
        };
      } else {
        // Freeform failed (e.g., outside 24hr window) but template was already sent
        console.log(`[WhatsApp Owner Alert] Full details text blocked (outside 24hr window) — template was already delivered.`);
        return { ...templateResult, fullDetailsSent: false, fullDetailsError: textData.error?.message };
      }
    } catch (textErr) {
      console.log(`[WhatsApp Owner Alert] Full details text error: ${textErr.message} — template was already delivered.`);
      return { ...templateResult, fullDetailsSent: false, fullDetailsError: textErr.message };
    }
  }

  return templateResult;
}

/**
 * Send WhatsApp status update message when order status changes (Shipped, Delivered, etc.).
 * Supports both rich text (inside 24h window) and approved template fallback (outside 24h window).
 */
export async function sendOrderStatusUpdate(order, newStatus) {
  const rawPhone = order.whatsappNumber || order.customerPhone;
  const cleanedPhone = formatPhoneNumber(rawPhone);

  if (!cleanedPhone) {
    return {
      success: false,
      status: 'failed',
      error: `Invalid phone number format: "${rawPhone}"`,
    };
  }

  if (!isWhatsAppConfigured()) {
    return {
      success: false,
      status: 'not_configured',
      error: 'WhatsApp Cloud API credentials are not configured in backend/.env',
    };
  }

  const apiUrl = `https://graph.facebook.com/${ENV.WHATSAPP_API_VERSION}/${ENV.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  // Status update message body
  const statusEmoji = newStatus.toLowerCase().includes('ship') ? '🚚' : newStatus.toLowerCase().includes('deliver') ? '🎁' : '✨';
  const textBody =
    `*🌸 Sree Collections - Order Status Update*\n\n` +
    `Hello *${order.customerName}*,\n` +
    `The status of your saree order *#${order.orderNumber}* has been updated to: *${newStatus.toUpperCase()}* ${statusEmoji}\n\n` +
    `*Order ID:* ${order.orderNumber}\n` +
    `*Updated Status:* *${newStatus.toUpperCase()}*\n` +
    `*Total Amount:* ₹${Number(order.totalAmount || 0).toLocaleString('en-IN')}\n\n` +
    `Thank you for shopping with Sree Collections! ✨\n` +
    `For any assistance or courier inquiries, reply directly to this chat.`;

  // 1. Attempt sending rich text message
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ENV.WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanedPhone,
        type: 'text',
        text: {
          preview_url: false,
          body: textBody,
        },
      }),
    });

    const data = await response.json();

    if (response.ok && data.messages && data.messages.length > 0) {
      return {
        success: true,
        status: 'sent',
        messageId: data.messages[0].id,
        recipient: cleanedPhone,
        sentAt: new Date(),
      };
    }

    console.warn(`[WhatsApp Status Update] Text send failed (${data.error?.message}), attempting template delivery...`);

    // 2. Fallback to approved template if freeform text was rejected (e.g. outside 24h window)
    const templatePayload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanedPhone,
      type: 'template',
      template: {
        name: ENV.WHATSAPP_TEMPLATE_NAME,
        language: {
          code: ENV.WHATSAPP_TEMPLATE_LANG || 'en',
        },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: String(order.customerName || 'Valued Customer').replace(/[\r\n\t]/g, ' ').trim().slice(0, 50) },
              { type: 'text', text: `#${order.orderNumber} Status: ${newStatus.toUpperCase()}`.replace(/[\r\n\t]/g, ' ').trim().slice(0, 50) },
              { type: 'text', text: `₹${Number(order.totalAmount || 0).toLocaleString('en-IN')} [${newStatus.toUpperCase()}]`.replace(/[\r\n\t]/g, ' ').trim().slice(0, 50) },
            ],
          },
        ],
      },
    };

    const tmplRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ENV.WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templatePayload),
    });

    const tmplData = await tmplRes.json();
    if (tmplRes.ok && tmplData.messages && tmplData.messages.length > 0) {
      return {
        success: true,
        status: 'sent',
        messageId: tmplData.messages[0].id,
        recipient: cleanedPhone,
        isTemplateFallback: true,
        sentAt: new Date(),
      };
    }

    return {
      success: false,
      status: 'failed',
      error: tmplData.error?.message || data.error?.message || 'Status update delivery failed',
      recipient: cleanedPhone,
    };
  } catch (error) {
    return {
      success: false,
      status: 'failed',
      error: error.message,
      recipient: cleanedPhone,
    };
  }
}

