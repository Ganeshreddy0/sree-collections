import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    _key: { type: String, default: 'store_settings', unique: true },
    shippingFee: { type: Number, default: 0, min: 0 },
    freeShippingThreshold: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
