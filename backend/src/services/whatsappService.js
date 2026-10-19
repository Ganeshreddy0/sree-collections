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
 * Send WhatsApp status update message when order status changes (Shipped, Delivered, etc.).
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
  const textBody =
    `*🌸 Sree Collections - Order Status Update*\n\n` +
    `Hello *${order.customerName}*,\n` +
    `The status of your order *${order.orderNumber}* has been updated to: *${newStatus.toUpperCase()}*.\n\n` +
    `*Order ID:* ${order.orderNumber}\n` +
    `*Total Amount:* ₹${Number(order.totalAmount || 0).toLocaleString('en-IN')}\n\n` +
    `Thank you for shopping with Sree Collections! ✨\n` +
    `For any assistance, reply to this chat.`;

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
        sentAt: new Date(),
      };
    }

    return {
      success: false,
      status: 'failed',
      error: data.error?.message || 'Status update delivery failed',
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
