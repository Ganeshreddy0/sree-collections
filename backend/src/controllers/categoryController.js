import Category from '../models/Category.js';

function formatCategory(c) {
  return {
    _id: c._id,
    id: c._id.toString(),
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.image || '',
    itemCount: c.itemCount || 0,
    featured: Boolean(c.featured),
    tag: c.tag || '',
    badge: c.tag || '',
    startingPrice: c.startingPrice || '',
    status: c.status || 'Active',
    date: c.createdAt
      ? new Date(c.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '',
    createdAt: c.createdAt,
  };
}

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (search && String(search).trim()) {
      query.name = { $regex: String(search).trim(), $options: 'i' };
    }
    if (status && status !== 'Status' && status !== 'all') {
      // Legacy documents may omit status — treat missing as Active
      if (status === 'Active') {
        query.$or = [
          { status: 'Active' },
          { status: { $exists: false } },
          { status: null },
          { status: '' },
        ];
      } else {
        query.status = status;
      }
    }

    const categories = await Category.find(query).sort({ featured: -1, name: 1 });
    res.json({
      success: true,
      count: categories.length,
      data: categories.map(formatCategory),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category (Admin)
// @route   POST /api/categories
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, featured, status, slug: bodySlug } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug =
      (bodySlug && String(bodySlug).trim()) ||
      String(name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const category = await Category.create({
      name: String(name).trim(),
      slug,
      description: description || '',
      image: image || '',
      featured: Boolean(featured),
      status: status === 'Inactive' ? 'Inactive' : 'Active',
    });

    res.status(201).json({
      success: true,
      data: formatCategory(category),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.badge !== undefined && updates.tag === undefined) {
      updates.tag = updates.badge;
    }
    if (updates.name && !updates.slug) {
      updates.slug = String(updates.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({
      success: true,
      data: formatCategory(category),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle category Active/Inactive
// @route   PATCH /api/categories/:id/status
export const toggleCategoryStatus = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const current = category.status || 'Active';
    category.status = current === 'Active' ? 'Inactive' : 'Active';
    await category.save();

    res.json({
      success: true,
      message: `Category marked ${category.status}`,
      data: { status: category.status },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
