import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Settings from '../models/Settings.js';
import {
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendOwnerOrderAlert,
  formatPhoneNumber,
  isWhatsAppConfigured,
} from '../services/whatsappService.js';
import { ENV } from '../config/env.js';

// @desc    Create new customer order (Supports guest and authenticated checkout)
// @route   POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      whatsappNumber,
      whatsappConsent = true,
      items,
      shippingAddress,
      notes = '',
    } = req.body;

    // Only COD is supported – reject any online payment attempt
    const paymentMethod = 'COD';

    // 1. Basic validation
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }

    const phoneToUse = (whatsappNumber || customerPhone || '').trim();
    if (!phoneToUse) {
      return res.status(400).json({ success: false, message: 'Customer mobile / WhatsApp number is required' });
    }

    const cleanedPhone = formatPhoneNumber(phoneToUse);
    if (!cleanedPhone) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile/WhatsApp number. Please provide a valid 10-digit number or international number with country code.',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order cart' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Complete delivery address (Street, City, State, Pincode) is required',
      });
    }

    // 2. Authoritative Price & Stock verification on the Backend
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const prodId = item.productId || item.product || item._id;
      if (!prodId) {
        return res.status(400).json({ success: false, message: 'Product ID is missing for an item' });
      }

      const product = await Product.findById(prodId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product "${item.title || prodId}" not found in inventory` });
      }

      let unitPrice = 0;
      let itemColour = item.colour || '';
      let itemSize = item.size || '';
      let itemSku = product.productCode || product.sku || '';
      let itemVariantId = item.variantId || null;
      const requestedQty = Number(item.quantity) || 1;

      if (requestedQty < 1) {
        return res.status(400).json({ success: false, message: `Invalid quantity for product ${product.productName || product.title}` });
      }

      // Check if product is Variable Product with matching variant
      if (itemVariantId && product.variants && product.variants.length > 0) {
        const variant = product.variants.id(itemVariantId);
        if (variant) {
          if (variant.stock < requestedQty) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock for ${product.productName || product.title} (${variant.colour || ''} / ${variant.size || ''}). Only ${variant.stock} available.`,
            });
          }

          // Deduct variant stock
          variant.stock -= requestedQty;
          unitPrice = variant.sellingPrice || variant.mrp || product.sellingPrice || product.price || 0;
          itemColour = variant.colour || itemColour;
          itemSize = variant.size || itemSize;
          itemSku = variant.sku || itemSku;
        } else {
          // Variant not found by ID, fallback to general product
          if (product.stock < requestedQty) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock for product: ${product.productName || product.title}. Only ${product.stock} available.`,
            });
          }
          unitPrice = product.sellingPrice || product.price || 0;
        }
      } else {
        // Single Product or general stock check
        const availableStock = product.stock !== undefined ? product.stock : product.quantity || 0;
        if (availableStock < requestedQty) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product: ${product.productName || product.title}. Only ${availableStock} available.`,
          });
        }
        unitPrice = product.sellingPrice || product.price || 0;
      }

      // Deduct main product stock
      const baseStock = product.stock !== undefined && product.stock !== null ? product.stock : (product.quantity || 0);
      product.stock = Math.max(0, baseStock - requestedQty);
      product.quantity = product.stock;
      await product.save();

      // Accumulate
      subtotal += unitPrice * requestedQty;

      // Primary image
      let displayImage = item.image || '';
      if (!displayImage) {
        if (itemColour && product.colourImages && product.colourImages.length > 0) {
          const cGroup = product.colourImages.find((c) => c.colour.toLowerCase() === itemColour.toLowerCase());
          if (cGroup && cGroup.images && cGroup.images.length > 0) {
            displayImage = cGroup.images[0];
          }
        }
        if (!displayImage) {
          displayImage = product.featuredImage || (product.images && product.images[0]) || '';
        }
      }

      verifiedItems.push({
        product: product._id,
        variantId: itemVariantId,
        sku: itemSku,
        title: product.productName || product.title,
        colour: itemColour,
        size: itemSize,
        price: unitPrice,
        quantity: requestedQty,
        image: displayImage,
      });
    }

    // Shipping fee: fetch from admin settings
    let storeShippingFee = 0;
    let storeFreeShippingThreshold = 0;
    try {
      const storeSettings = await Settings.findOne({ _key: 'store_settings' });
      if (storeSettings) {
        storeShippingFee = storeSettings.shippingFee || 0;
        storeFreeShippingThreshold = storeSettings.freeShippingThreshold || 0;
      }
    } catch (settingsErr) {
      console.warn('[Order] Could not fetch store settings, defaulting shipping fee to 0:', settingsErr.message);
    }

    // Apply free-shipping threshold rule
    const shippingFee =
      storeFreeShippingThreshold > 0 && subtotal >= storeFreeShippingThreshold
        ? 0
        : storeShippingFee;
    const totalAmount = subtotal + shippingFee;

    // 3. Generate unique human-readable Order Number
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randPart = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SRC-${datePart}-${randPart}`;

    // 4. Create and persist Order in MongoDB Atlas
    const orderData = {
      orderNumber,
      user: req.user?._id || null,
      customerName: customerName.trim(),
      customerEmail: (customerEmail || req.user?.email || '').trim(),
      customerPhone: phoneToUse,
      whatsappNumber: cleanedPhone,
      whatsappConsent: Boolean(whatsappConsent),
      items: verifiedItems,
      shippingAddress: {
        fullName: shippingAddress.fullName || customerName.trim(),
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim(),
        country: shippingAddress.country || 'India',
      },
      subtotal,
      shippingFee,
      discount: 0,
      totalAmount,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Confirmed',
      notes: notes || '',
      whatsappNotification: {
        status: 'pending',
        messageId: '',
        sentAt: null,
        lastAttemptAt: null,
        error: '',
        attempts: 0,
        templateName: ENV.WHATSAPP_TEMPLATE_NAME,
        logs: [],
      },
    };

    const order = await Order.create(orderData);

    // 5. Automatically send WhatsApp Order Confirmation via Meta Cloud API
    let whatsappResult = {
      sent: false,
      status: 'pending',
      messageId: '',
      error: '',
    };

    if (order.whatsappConsent) {
      try {
        const waRes = await sendOrderConfirmation(order);
        order.whatsappNotification.attempts = 1;
        order.whatsappNotification.lastAttemptAt = new Date();
        order.whatsappNotification.status = waRes.status;
        order.whatsappNotification.messageId = waRes.messageId || '';
        order.whatsappNotification.error = waRes.error || '';
        if (waRes.sentAt) order.whatsappNotification.sentAt = waRes.sentAt;

        order.whatsappNotification.logs.push({
          timestamp: new Date(),
          type: 'order_confirmation',
          status: waRes.status,
          recipient: waRes.recipient || cleanedPhone,
          messageId: waRes.messageId || '',
          error: waRes.error || '',
          details: waRes,
        });

        await order.save();

        whatsappResult = {
          sent: waRes.success === true,
          status: waRes.status,
          messageId: waRes.messageId || '',
          error: waRes.error || '',
          recipient: cleanedPhone,
        };
      } catch (waError) {
        console.error('[Order] Error executing WhatsApp confirmation:', waError);
        order.whatsappNotification.status = 'failed';
        order.whatsappNotification.error = waError.message;
        await order.save();
        whatsappResult = {
          sent: false,
          status: 'failed',
          messageId: '',
          error: waError.message,
          recipient: cleanedPhone,
        };
      }
    } else {
      order.whatsappNotification.status = 'not_configured';
      order.whatsappNotification.error = 'Customer opted out of WhatsApp updates';
      await order.save();
      whatsappResult = {
        sent: false,
        status: 'not_configured',
        message: 'Customer did not consent to WhatsApp notification',
      };
    }

    // 6. Send immediate WhatsApp Alert to Store Owner (contains customer details, items, address, total)
    let ownerWhatsappResult = {
      sent: false,
      status: 'pending',
      messageId: '',
      error: '',
    };
    try {
      const ownerRes = await sendOwnerOrderAlert(order);
      console.log(`[Order #${order.orderNumber}] Owner WhatsApp alert result:`, ownerRes);

      if (order.whatsappNotification && Array.isArray(order.whatsappNotification.logs)) {
        order.whatsappNotification.logs.push({
          timestamp: new Date(),
          type: 'owner_alert',
          status: ownerRes.status,
          recipient: ownerRes.recipient || ENV.OWNER_WHATSAPP_PHONE || '919948469132',
          messageId: ownerRes.messageId || '',
          error: ownerRes.error || '',
          details: ownerRes,
        });
        await order.save();
      }

      ownerWhatsappResult = {
        sent: ownerRes.success === true,
        status: ownerRes.status,
        messageId: ownerRes.messageId || '',
        error: ownerRes.error || '',
        recipient: ownerRes.recipient,
      };
    } catch (ownerAlertErr) {
      console.error('[Order] Error sending owner WhatsApp alert:', ownerAlertErr);
      ownerWhatsappResult = {
        sent: false,
        status: 'failed',
        error: ownerAlertErr.message,
      };
    }

    res.status(201).json({
      success: true,
      message: 'Order created and saved successfully',
      data: order,
      whatsapp: whatsappResult,
      ownerWhatsapp: ownerWhatsappResult,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Retry sending WhatsApp Order Confirmation without creating duplicate orders
// @route   POST /api/orders/:id/retry-whatsapp
export const retryWhatsAppNotification = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const waRes = await sendOrderConfirmation(order);

    order.whatsappNotification.attempts = (order.whatsappNotification.attempts || 0) + 1;
    order.whatsappNotification.lastAttemptAt = new Date();
    order.whatsappNotification.status = waRes.status;
    order.whatsappNotification.messageId = waRes.messageId || order.whatsappNotification.messageId;
    order.whatsappNotification.error = waRes.error || '';
    if (waRes.sentAt) order.whatsappNotification.sentAt = waRes.sentAt;

    order.whatsappNotification.logs.push({
      timestamp: new Date(),
      type: 'retry_confirmation',
      status: waRes.status,
      recipient: waRes.recipient || order.whatsappNumber || order.customerPhone,
      messageId: waRes.messageId || '',
      error: waRes.error || '',
      details: waRes,
    });

    await order.save();

    res.json({
      success: true,
      message: waRes.success
        ? 'WhatsApp confirmation sent successfully'
        : `WhatsApp delivery attempted: ${waRes.status} - ${waRes.error}`,
      data: order,
      whatsappResult: waRes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
export const getMyOrders = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details by ID or Order Number
// @route   GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let order;

    // Check if ID is a Mongo ObjectId or Order Number string
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    } else {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Allow user to view if owner or admin or guest viewing placed order
    res.json({
      success: true,
      data: order,
      meta: {
        isWhatsAppConfigured: isWhatsAppConfigured(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin Panel) with search, filters, pagination
// @route   GET /api/orders
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, whatsappStatus, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    if (whatsappStatus && whatsappStatus !== 'All') {
      query['whatsappNotification.status'] = whatsappStatus;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderNumber: regex },
        { customerName: regex },
        { customerPhone: regex },
        { whatsappNumber: regex },
        { customerEmail: regex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: orders.length,
      total,
      data: orders,
      isWhatsAppConfigured: isWhatsAppConfigured(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin) & trigger WhatsApp update to customer
// @route   PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, sendWhatsAppNotification = true } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.orderStatus;
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    // Send WhatsApp status notification to customer if requested
    let statusWaResult = null;
    if (sendWhatsAppNotification && (orderStatus || paymentStatus)) {
      try {
        const targetStatus = orderStatus || order.orderStatus;
        statusWaResult = await sendOrderStatusUpdate(order, targetStatus);

        if (!order.whatsappNotification) {
          order.whatsappNotification = { attempts: 0, logs: [] };
        }
        if (!Array.isArray(order.whatsappNotification.logs)) {
          order.whatsappNotification.logs = [];
        }

        order.whatsappNotification.logs.push({
          timestamp: new Date(),
          type: 'status_update',
          status: statusWaResult?.status || 'unknown',
          recipient: statusWaResult?.recipient || order.whatsappNumber || order.customerPhone,
          messageId: statusWaResult?.messageId || '',
          error: statusWaResult?.error || '',
          details: { previousStatus, newStatus: targetStatus, ...statusWaResult },
        });

        if (statusWaResult?.status === 'sent') {
          order.whatsappNotification.status = 'sent';
          order.whatsappNotification.sentAt = new Date();
          order.whatsappNotification.error = '';
        } else if (statusWaResult?.error) {
          order.whatsappNotification.error = statusWaResult.error;
        }
      } catch (err) {
        console.error('[Order] Status update WhatsApp notification error:', err);
        statusWaResult = { success: false, status: 'failed', error: err.message };
      }
    }

    await order.save();

    res.json({
      success: true,
      message: statusWaResult?.success
        ? `Order status updated to "${order.orderStatus}" and WhatsApp notification delivered to customer.`
        : statusWaResult?.error
        ? `Order status updated to "${order.orderStatus}". WhatsApp note: ${statusWaResult.error}`
        : `Order status updated to "${order.orderStatus}".`,
      data: order,
      whatsappUpdate: statusWaResult,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually trigger WhatsApp Alert to Store Owner for an order
// @route   POST /api/orders/:id/owner-alert
export const triggerOwnerAlert = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const ownerRes = await sendOwnerOrderAlert(order);

    if (!order.whatsappNotification) {
      order.whatsappNotification = { attempts: 0, logs: [] };
    }
    if (!Array.isArray(order.whatsappNotification.logs)) {
      order.whatsappNotification.logs = [];
    }

    order.whatsappNotification.logs.push({
      timestamp: new Date(),
      type: 'manual_owner_alert',
      status: ownerRes.status,
      recipient: ownerRes.recipient || ENV.OWNER_WHATSAPP_PHONE || '919948469132',
      messageId: ownerRes.messageId || '',
      error: ownerRes.error || '',
      details: ownerRes,
    });

    await order.save();

    res.json({
      success: ownerRes.success === true,
      message: ownerRes.success
        ? 'Owner WhatsApp alert sent successfully!'
        : `Owner WhatsApp attempt: ${ownerRes.status} - ${ownerRes.error}`,
      data: order,
      ownerWhatsappResult: ownerRes,
    });
  } catch (error) {
    next(error);
  }
};
