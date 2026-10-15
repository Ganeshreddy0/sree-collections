import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products with filters, sorting, search, pagination
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      status,
      minPrice,
      maxPrice,
      featured,
      sort,
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};
    if (status && status !== 'Status') {
      query.isActive = status === 'Active';
    } else if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    // Search by name, title, code, brand, description
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { productCode: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by Category
    if (category && category !== 'Category') {
      if (typeof category === 'string' && category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        query.$or = [
          { categoryName: { $regex: `^${category}$`, $options: 'i' } },
          { category: category },
        ];
      }
    }

    // Filter by Brand
    if (brand && brand !== 'Brand') {
      query.brand = { $regex: `^${brand}$`, $options: 'i' };
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

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // Map to normalized frontend format while keeping full document
    const formatted = products.map((p) => ({
      _id: p._id,
      id: p._id.toString(),
      code: p.productCode || p.sku || 'PT000',
      productCode: p.productCode || p.sku,
      name: p.productName || p.title || 'Untitled',
      productName: p.productName || p.title,
      category: p.categoryName || (typeof p.category === 'string' ? p.category : 'General'),
      subCategory: p.subCategory || '',
      brand: p.brand || '---',
      price: `$${p.price}`,
      rawPrice: p.price,
      unit: p.unit || 'Pc',
      qty: p.quantity !== undefined ? p.quantity : p.stock,
      quantity: p.quantity !== undefined ? p.quantity : p.stock,
      img: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=100&q=80',
      images: p.images || [],
      sellingType: p.sellingType,
      productType: p.productType,
      taxType: p.taxType,
      discountType: p.discountType,
      discountValue: p.discountValue,
      quantityAlert: p.quantityAlert,
      variantType: p.variantType,
      attributes: p.attributes || {},
      description: p.description,
      isActive: p.isActive !== false,
      status: p.isActive !== false ? 'Active' : 'Inactive',
      createdAt: p.createdAt,
    }));

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / Number(limit)) || 1,
      currentPage: Number(page),
      data: formatted,
      raw: products,
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
      product = await Product.findById(idOrSlug);
    } else {
      product = await Product.findOne({
        $or: [{ slug: idOrSlug }, { productCode: idOrSlug }, { sku: idOrSlug }],
      });
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
      productName,
      title,
      slug: reqSlug,
      productCode,
      sku,
      sellingType,
      category,
      subCategory,
      brand,
      unit,
      description,
      productType,
      quantity,
      stock,
      price,
      taxType,
      discountType,
      discountValue,
      quantityAlert,
      variantType,
      size,
      colour,
      weight,
      pattern,
      style,
      material,
      attributes: reqAttributes,
      images,
    } = req.body;

    const finalName = productName || title;
    if (!finalName) {
      return res.status(400).json({ success: false, message: 'Product Name is required' });
    }

    // Auto generate slug if missing
    let finalSlug = reqSlug;
    if (!finalSlug || finalSlug.trim() === '') {
      finalSlug = (
        finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
        '-' +
        Math.floor(1000 + Math.random() * 9000)
      ).replace(/(^-|-$)/g, '');
    }

    // Ensure slug is unique
    const existingSlug = await Product.findOne({ slug: finalSlug });
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Auto generate product code if missing
    let finalCode = productCode || sku;
    if (!finalCode || finalCode.trim() === '') {
      const count = await Product.countDocuments();
      finalCode = `PT${String(count + 1).padStart(3, '0')}`;
    }

    // Ensure productCode is unique
    const existingCode = await Product.findOne({ productCode: finalCode });
    if (existingCode) {
      finalCode = `${finalCode}-${Date.now().toString().slice(-3)}`;
    }

    // Resolve category name
    let catName = '';
    let categoryValue = category || 'General';
    if (category && typeof category === 'string' && category.match(/^[0-9a-fA-F]{24}$/)) {
      const catDoc = await Category.findById(category);
      if (catDoc) {
        catName = catDoc.name;
        categoryValue = catDoc._id;
        // increment category count
        await Category.findByIdAndUpdate(catDoc._id, { $inc: { itemCount: 1 } });
      }
    } else if (typeof category === 'string') {
      catName = category;
      const catDoc = await Category.findOne({ name: category });
      if (catDoc) {
        categoryValue = catDoc._id;
        await Category.findByIdAndUpdate(catDoc._id, { $inc: { itemCount: 1 } });
      }
    }

    // Handle attributes
    const attributes = reqAttributes || {
      size: size || '',
      colour: colour || '',
      weight: weight || '',
      pattern: pattern || '',
      style: style || '',
      material: material || '',
    };

    // Calculate discount price
    const numPrice = Number(price) || 0;
    const numDiscount = Number(discountValue) || 0;
    let discountPrice = null;
    if (discountType === 'Percentage' && numDiscount > 0) {
      discountPrice = Math.max(0, numPrice - (numPrice * numDiscount) / 100);
    } else if (discountType === 'Fixed' && numDiscount > 0) {
      discountPrice = Math.max(0, numPrice - numDiscount);
    }

    const finalQuantity = Number(quantity) !== undefined && quantity !== '' ? Number(quantity) : Number(stock) || 0;

    const product = await Product.create({
      productName: finalName,
      title: finalName,
      slug: finalSlug,
      productCode: finalCode,
      sku: finalCode,
      sellingType: sellingType || 'B2C',
      category: categoryValue,
      categoryName: catName || (typeof category === 'string' ? category : 'General'),
      subCategory: subCategory || '',
      brand: brand || '---',
      unit: unit || 'Pc',
      description: description || '',
      productType: productType || 'Single Product',
      quantity: finalQuantity,
      stock: finalQuantity,
      price: numPrice,
      taxType: taxType || 'GST 5%',
      discountType: discountType || 'None',
      discountValue: numDiscount,
      discountPrice,
      quantityAlert: Number(quantityAlert) || 5,
      variantType: variantType || 'Single Product',
      attributes,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=100&q=80'],
      isActive: req.body.status !== undefined ? req.body.status === 'Active' : (req.body.isActive !== undefined ? Boolean(req.body.isActive) : true),
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
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
    });

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

    if (product.category && typeof product.category === 'string' && product.category.match(/^[0-9a-fA-F]{24}$/)) {
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

// @desc    Toggle product Active / Inactive status
// @route   PATCH /api/products/:id/status
export const toggleProductStatus = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    product.isActive = !product.isActive;
    await product.save();
    const statusLabel = product.isActive ? 'Active' : 'Inactive';
    res.json({ success: true, message: `Product marked ${statusLabel}`, data: { isActive: product.isActive, status: statusLabel } });
  } catch (error) {
    next(error);
  }
};
