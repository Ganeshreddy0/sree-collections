import Settings from '../models/Settings.js';

const getOrCreate = async () => {
  let s = await Settings.findOne({ _key: 'store_settings' });
  if (!s) s = await Settings.create({ _key: 'store_settings' });
  return s;
};

// GET /api/settings  – public (storefront fetches shipping fee)
export const getSettings = async (req, res, next) => {
  try {
    const s = await getOrCreate();
    res.json({ success: true, data: s });
  } catch (error) {
    next(error);
  }
};

// PUT /api/settings  – admin only
export const updateSettings = async (req, res, next) => {
  try {
    const fee = Number(req.body.shippingFee ?? 0);
    const threshold = Number(req.body.freeShippingThreshold ?? 0);

    if (isNaN(fee) || fee < 0)
      return res.status(400).json({ success: false, message: 'Shipping fee must be ≥ 0' });
    if (isNaN(threshold) || threshold < 0)
      return res.status(400).json({ success: false, message: 'Free shipping threshold must be ≥ 0' });

    const s = await Settings.findOneAndUpdate(
      { _key: 'store_settings' },
      { $set: { shippingFee: fee, freeShippingThreshold: threshold } },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: 'Shipping settings updated', data: s });
  } catch (error) {
    next(error);
  }
};

