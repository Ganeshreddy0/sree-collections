import mongoose from 'mongoose';

/* ── Variant sub-schema ── */
const variantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, trim: true },
    size: { type: String, default: '' },
    colour: { type: String, default: '' },
    mrp: { type: Number, default: 0, min: 0 },
    sellingPrice: { type: Number, default: 0, min: 0 },
    discountType: { type: String, default: 'None' },
    discountValue: { type: Number, default: 0, min: 0 },
    discountPrice: { type: Number, default: null },
    stock: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

/* ── Colour images sub-schema ── */
const colourImageSchema = new mongoose.Schema(
  {
    colour: { type: String, required: true },
    images: [{ type: String }],
    primaryImage: { type: String, default: '' },
  },
  { _id: false }
);

/* ── Main product schema ── */
const productSchema = new mongoose.Schema(
  {
    // ── Product Information ──────────────────────────────
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    title: { type: String, trim: true },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    productCode: {
      type: String,
      required: [true, 'Product code is required'],
      unique: true,
      trim: true,
    },
    sku: { type: String, unique: true, sparse: true, trim: true },
    sellingType: {
      type: String,
      enum: ['B2B', 'B2C', 'Both', ''],
      default: 'B2C',
    },
    category: {
      type: mongoose.Schema.Types.Mixed, // ObjectId or string name
      required: [true, 'Category is required'],
    },
    categoryName: { type: String, default: '' },
    subCategory: { type: String, default: '' },
    brand: { type: String, default: '' },
    unit: { type: String, default: 'Pc' },
    description: { type: String, default: '' },

    // ── Pricing & Stock ─────────────────────────────────
    productType: {
      type: String,
      enum: ['Single Product', 'Variable Product'],
      default: 'Single Product',
    },
    mrp: { type: Number, default: 0, min: 0 },          // original / max retail price
    sellingPrice: { type: Number, default: 0, min: 0 }, // actual selling price
    price: { type: Number, default: 0, min: 0 },        // alias kept for backward compat
    taxType: { type: String, default: 'GST 5%' },
    taxRate: { type: Number, default: 5 },
    discountType: { type: String, default: 'None' },
    discountValue: { type: Number, default: 0, min: 0 },
    discountPrice: { type: Number, default: null },
    quantity: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    quantityAlert: { type: Number, default: 5, min: 0 },

    // ── Display Settings ────────────────────────────────
    featured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    featuredImage: { type: String, default: '' },

    // ── Variant Attributes (simple product) ─────────────
    variantType: {
      type: String,
      enum: ['Single Product', 'Variable Product'],
      default: 'Single Product',
    },
    attributes: {
      size: { type: String, default: '' },
      colour: { type: String, default: '' },
      weight: { type: String, default: '' },
      pattern: { type: String, default: '' },
      style: { type: String, default: '' },
      material: { type: String, default: '' },
    },
    // Selected size/colour pools (comma-separated for variable products)
    selectedSizes: [{ type: String }],
    selectedColours: [{ type: String }],

    // ── Variable Product Variants ────────────────────────
    variants: [variantSchema],

    // ── Images ──────────────────────────────────────────
    images: [{ type: String }],
    colourImages: [colourImageSchema], // per-colour image galleries

    // ── Additional Info ──────────────────────────────────
    fabric: { type: String, default: '' },
    careInstructions: { type: String, default: '' },
    specifications: { type: String, default: '' },
    shippingInfo: { type: String, default: '' },
    returnPolicy: { type: String, default: '' },
    weight: { type: String, default: '' },
    dimensions: { type: String, default: '' },
    tags: [{ type: String }],

    // ── Meta & Status ────────────────────────────────────
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/* ── Pre-save hooks ── */
productSchema.pre('save', function (next) {
  // Keep productName / title in sync
  if (this.productName && !this.title) this.title = this.productName;
  else if (this.title && !this.productName) this.productName = this.title;

  // Keep productCode / sku in sync
  if (this.productCode && !this.sku) this.sku = this.productCode;
  else if (this.sku && !this.productCode) this.productCode = this.sku;

  // Keep quantity / stock in sync
  if (this.isModified('quantity') && this.stock === 0) this.stock = this.quantity;
  else if (this.isModified('stock') && this.quantity === 0) this.quantity = this.stock;

  // Keep price alias in sync with sellingPrice
  if (this.sellingPrice > 0 && this.price === 0) this.price = this.sellingPrice;
  else if (this.price > 0 && this.sellingPrice === 0) this.sellingPrice = this.price;

  // If mrp not set, default to price
  if (this.mrp === 0 && this.price > 0) this.mrp = this.price;

  next();
});

/* ── Text index ── */
productSchema.index({
  productName: 'text',
  title: 'text',
  description: 'text',
  productCode: 'text',
  brand: 'text',
  tags: 'text',
});

const Product = mongoose.model('Product', productSchema);
export default Product;
