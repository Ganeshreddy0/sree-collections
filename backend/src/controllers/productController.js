import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products with filters, sorting, search, pagination
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      fabric,
      occasion,
      minPrice,
      maxPrice,
      featured,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { isActive: true };

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { fabric: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by Category
    if (category) {
      // Check if ObjectId or slug
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const catDoc = await Category.findOne({ slug: category });
        if (catDoc) query.category = catDoc._id;
      }
    }

    // Filter by Fabric
    if (fabric) {
      query.fabric = { $regex: fabric, $options: 'i' };
    }

    // Filter by Occasion
    if (occasion) {
      query.occasion = { $regex: occasion, $options: 'i' };
    }

    // Filter by Featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Price Range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') sortOptions = { price: 1 };
    if (sort === 'price-high') sortOptions = { price: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };
    if (sort === 'popular') sortOptions = { numReviews: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:idOrSlug
export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let product;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug: idOrSlug }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      category,
      stock,
      images,
      fabric,
      occasion,
      color,
      blouseIncluded,
      featured,
    } = req.body;

    const slug = (
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
      '-' +
      Math.floor(1000 + Math.random() * 9000)
    ).replace(/(^-|-$)/g, '');

    const catDoc = await Category.findById(category);

    const product = await Product.create({
      title,
      slug,
      sku: `SREE-${Date.now().toString().slice(-6)}`,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      category,
      categoryName: catDoc ? catDoc.name : '',
      stock: Number(stock) || 0,
      images: Array.isArray(images) ? images : [images],
      fabric: fabric || 'Silk',
      occasion: occasion || 'Festive',
      color: color || 'Classic',
      blouseIncluded: Boolean(blouseIncluded),
      featured: Boolean(featured),
    });

    // Update item count on category
    if (catDoc) {
      await Category.findByIdAndUpdate(category, { $inc: { itemCount: 1 } });
    }

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.category) {
      await Category.findByIdAndUpdate(product.category, { $inc: { itemCount: -1 } });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
