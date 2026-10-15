import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Get all categories with search and status filter
// @route   GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } },
    ];
    if (status && status !== 'Status') query.status = status;

    const categories = await Category.find(query).sort({ createdAt: -1 });

    const formatted = categories.map((c) => ({
      _id: c._id,
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      date: new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: c.status || 'Active',
      itemCount: c.itemCount || 0,
      image: c.image || '',
      description: c.description || '',
    }));

    res.json({ success: true, count: categories.length, data: formatted });
  } catch (error) { next(error); }
};

// @desc    Get single category
// @route   GET /api/categories/:idOrSlug
export const getCategoryByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const category = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
      ? await Category.findById(idOrSlug)
      : await Category.findOne({ slug: idOrSlug });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (error) { next(error); }
};

// @desc    Create category
// @route   POST /api/categories
export const createCategory = async (req, res, next) => {
  try {
    const { name, categoryName, slug: reqSlug, status, description, image, featured } = req.body;
    const finalName = (name || categoryName || '').trim();
    if (!finalName) return res.status(400).json({ success: false, message: 'Category name is required' });

    let finalSlug = (reqSlug || finalName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (await Category.findOne({ name: new RegExp(`^${finalName}$`, 'i') }))
      return res.status(400).json({ success: false, message: `Category "${finalName}" already exists` });
    if (await Category.findOne({ slug: finalSlug }))
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;

    const category = await Category.create({ name: finalName, slug: finalSlug, status: status || 'Active', description: description || '', image: image || '', featured: Boolean(featured) });
    res.status(201).json({ success: true, message: 'Category created successfully', data: category });
  } catch (error) { next(error); }
};

// @desc    Update category fields
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const { name, slug, status, description, image } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (slug) updates.slug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (status) updates.status = status;
    if (description !== undefined) updates.description = description;
    if (image !== undefined) updates.image = image;

    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category updated', data: category });
  } catch (error) { next(error); }
};

// @desc    Toggle Active / Inactive status
// @route   PATCH /api/categories/:id/status
export const toggleCategoryStatus = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    category.status = category.status === 'Active' ? 'Inactive' : 'Active';
    await category.save();
    res.json({ success: true, message: `Category marked ${category.status}`, data: { status: category.status } });
  } catch (error) { next(error); }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    await Product.updateMany({ $or: [{ category: category._id }, { categoryName: category.name }] }, { $set: { categoryName: 'Uncategorized' } });
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) { next(error); }
};
