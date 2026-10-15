import SubCategory from '../models/SubCategory.js';

export const getSubCategories = async (req, res, next) => {
  try {
    const { category, search, status } = req.query;
    const query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (status && status !== 'Status') query.status = status;

    const items = await SubCategory.find(query).sort({ createdAt: -1 });
    const formatted = items.map((s) => ({
      _id: s._id, id: s._id.toString(),
      name: s.name, category: s.category, slug: s.slug || '',
      status: s.status || 'Active',
      date: new Date(s.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
    res.json({ success: true, count: items.length, data: formatted });
  } catch (error) { next(error); }
};

export const createSubCategory = async (req, res, next) => {
  try {
    const { name, subCategoryName, category, status } = req.body;
    const finalName = (name || subCategoryName || '').trim();
    if (!finalName || !category) return res.status(400).json({ success: false, message: 'Name and category are required' });
    const item = await SubCategory.create({ name: finalName, category, status: status || 'Active' });
    res.status(201).json({ success: true, message: 'Sub Category created successfully', data: item });
  } catch (error) { next(error); }
};

export const updateSubCategory = async (req, res, next) => {
  try {
    const { name, category, status } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (category) updates.category = category;
    if (status) updates.status = status;
    const item = await SubCategory.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Subcategory not found' });
    res.json({ success: true, message: 'Subcategory updated', data: item });
  } catch (error) { next(error); }
};

export const toggleSubCategoryStatus = async (req, res, next) => {
  try {
    const item = await SubCategory.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Subcategory not found' });
    item.status = item.status === 'Active' ? 'Inactive' : 'Active';
    await item.save();
    res.json({ success: true, message: `Subcategory marked ${item.status}`, data: { status: item.status } });
  } catch (error) { next(error); }
};

export const deleteSubCategory = async (req, res, next) => {
  try {
    const item = await SubCategory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Subcategory not found' });
    res.json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) { next(error); }
};
