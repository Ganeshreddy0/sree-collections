import Brand from '../models/Brand.js';

export const getBrands = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (status && status !== 'Status') query.status = status;

    const items = await Brand.find(query).sort({ createdAt: -1 });
    const formatted = items.map((b) => ({
      _id: b._id, id: b._id.toString(),
      name: b.name, slug: b.slug || '', countryOrigin: b.countryOrigin || '',
      status: b.status || 'Active',
      date: new Date(b.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
    res.json({ success: true, count: items.length, data: formatted });
  } catch (error) { next(error); }
};

export const createBrand = async (req, res, next) => {
  try {
    const { name, brandName, countryOrigin, status } = req.body;
    const finalName = (name || brandName || '').trim();
    if (!finalName) return res.status(400).json({ success: false, message: 'Brand name is required' });
    if (await Brand.findOne({ name: new RegExp(`^${finalName}$`, 'i') }))
      return res.status(400).json({ success: false, message: `Brand "${finalName}" already exists` });
    const brand = await Brand.create({ name: finalName, countryOrigin: countryOrigin || '', status: status || 'Active' });
    res.status(201).json({ success: true, message: 'Brand created successfully', data: brand });
  } catch (error) { next(error); }
};

export const updateBrand = async (req, res, next) => {
  try {
    const { name, countryOrigin, status } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (countryOrigin !== undefined) updates.countryOrigin = countryOrigin;
    if (status) updates.status = status;
    const brand = await Brand.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.json({ success: true, message: 'Brand updated', data: brand });
  } catch (error) { next(error); }
};

export const toggleBrandStatus = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    brand.status = brand.status === 'Active' ? 'Inactive' : 'Active';
    await brand.save();
    res.json({ success: true, message: `Brand marked ${brand.status}`, data: { status: brand.status } });
  } catch (error) { next(error); }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const item = await Brand.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.json({ success: true, message: 'Brand deleted successfully' });
  } catch (error) { next(error); }
};
