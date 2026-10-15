import mongoose from 'mongoose';

const variantAttributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Variant attribute name is required'],
      trim: true,
      unique: true,
    },
    values: {
      type: [String],
      default: [],
    },
    valueString: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

variantAttributeSchema.pre('save', function (next) {
  if (this.values && this.values.length > 0 && !this.valueString) {
    this.valueString = this.values.join(', ');
  }
  next();
});

const VariantAttribute = mongoose.model('VariantAttribute', variantAttributeSchema);
export default VariantAttribute;
