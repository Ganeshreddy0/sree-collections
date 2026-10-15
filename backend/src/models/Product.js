import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Product Information
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
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
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    sellingType: {
      type: String,
      enum: ['B2B', 'B2C', 'Both', ''],
      default: 'B2C',
    },
    category: {
      type: mongoose.Schema.Types.Mixed, // Can be ObjectId ref or string name
      required: [true, 'Category is required'],
    },
    categoryName: {
      type: String,
      default: '',
    },
    subCategory: {
      type: String,
      default: '',
    },
    brand: {
      type: String,
      default: '',
    },
    unit: {
      type: String,
      default: 'Pc',
    },
    description: {
      type: String,
      default: '',
    },

    // Pricing & Stocks
    productType: {
      type: String,
      enum: ['Single Product', 'Variable Product'],
      default: 'Single Product',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    taxType: {
      type: String,
      default: 'GST 5%',
    },
    discountType: {
      type: String,
      default: 'None',
    },
    discountValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    quantityAlert: {
      type: Number,
      default: 5,
      min: 0,
    },

    // Variant Attributes
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

    // Images
    images: [
      {
        type: String,
        required: true,
      },
    ],

    // Meta & Status
    featured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to keep title and productName in sync, as well as stock and quantity
productSchema.pre('save', function (next) {
  if (this.productName && !this.title) {
    this.title = this.productName;
  } else if (this.title && !this.productName) {
    this.productName = this.title;
  }

  if (this.productCode && !this.sku) {
    this.sku = this.productCode;
  } else if (this.sku && !this.productCode) {
    this.productCode = this.sku;
  }

  if (this.quantity !== undefined && this.stock === 0) {
    this.stock = this.quantity;
  } else if (this.stock !== undefined && this.quantity === 0) {
    this.quantity = this.stock;
  }

  next();
});

// Text index for search
productSchema.index({ productName: 'text', title: 'text', description: 'text', productCode: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
