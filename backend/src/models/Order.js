import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  variantId: { type: String, default: null },
  sku: { type: String, default: '' },
  title: { type: String, required: true },
  colour: { type: String, default: '' },
  size: { type: String, default: '' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
});

const whatsappLogSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    type: { type: String, default: 'order_confirmation' },
    status: { type: String, enum: ['sent', 'failed', 'not_configured', 'pending'], default: 'pending' },
    recipient: { type: String, default: '' },
    messageId: { type: String, default: '' },
    error: { type: String, default: '' },
    details: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      default: '',
    },
    customerPhone: {
      type: String,
      required: true,
    },
    whatsappNumber: {
      type: String,
      default: '',
    },
    whatsappConsent: {
      type: Boolean,
      default: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, default: '' },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    subtotal: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['COD'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Confirmed',
    },
    notes: {
      type: String,
      default: '',
    },
    whatsappNotification: {
      status: {
        type: String,
        enum: ['not_configured', 'pending', 'sent', 'failed'],
        default: 'pending',
      },
      messageId: { type: String, default: '' },
      sentAt: { type: Date, default: null },
      lastAttemptAt: { type: Date, default: null },
      error: { type: String, default: '' },
      attempts: { type: Number, default: 0 },
      templateName: { type: String, default: '' },
      logs: [whatsappLogSchema],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;

