import Product from '../models/Product.js';
import Category from '../models/Category.js';

/* ─────────────────────────────────────────────────
   Helper: compute discount price
───────────────────────────────────────────────── */
function calcDiscountPrice(basePrice, discountType, discountValue) {
  const p = Number(basePrice) || 0;
  const d = Number(discountValue) || 0;
  if (discountType === 'Percentage' && d > 0) return Math.max(0, p - (p * d) / 100);
  if ((discountType === 'Fixed' || discountType === 'Fixed Amount') && d > 0) return Math.max(0, p - d);
  return null;
}

/* ─────────────────────────────────────────────────
   Helper: resolve tax rate from taxType string
───────────────────────────────────────────────── */
function resolveTaxRate(taxType) {
  if (!taxType) return 0;
  const m = taxType.match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

/* ─────────────────────────────────────────────────
   Format product for list views
───────────────────────────────────────────────── */
function formatProduct(p) {
  const mainPrice = p.sellingPrice || p.price || 0;
  return {
    _id: p._id,
    id: p._id.toString(),
    code: p.productCode || p.sku || 'PT000',
    productCode: p.productCode || p.sku,
    name: p.productName || p.title || 'Untitled',
    productName: p.productName || p.title,
    category: p.categoryName || (typeof p.category === 'string' ? p.category : 'General'),
    subCategory: p.subCategory || '',
    brand: p.brand || '---',
    mrp: p.mrp || 0,
    sellingPrice: mainPrice,
    price: `₹${mainPrice}`,
    rawPrice: mainPrice,
    discountType: p.discountType,
    discountValue: p.discountValue,
    discountPrice: p.discountPrice,
    taxType: p.taxType,
    unit: p.unit || 'Pc',
    qty: p.quantity !== undefined ? p.quantity : p.stock,
    quantity: p.quantity !== undefined ? p.quantity : p.stock,
    img: p.featuredImage || (p.images && p.images.length > 0 ? p.images[0] : ''),
    images: p.images || [],
    colourImages: p.colourImages || [],
    featuredImage: p.featuredImage || '',
    sellingType: p.sellingType,
    productType: p.productType,
    variantType: p.variantType,
    variants: p.variants || [],
    selectedSizes: p.selectedSizes || [],
    selectedColours: p.selectedColours || [],
    attributes: p.attributes || {},
    description: p.description,
    featured: p.featured || false,
    isBestSeller: p.isBestSeller || false,
    isNewArrival: p.isNewArrival !== false,
    displayOrder: p.displayOrder || 0,
    // Additional info
    fabric: p.fabric || '',
    careInstructions: p.careInstructions || '',
    specifications: p.specifications || '',
    shippingInfo: p.shippingInfo || '',
    returnPolicy: p.returnPolicy || '',
    weight: p.weight || '',
    dimensions: p.dimensions || '',
    tags: p.tags || [],
    isActive: p.isActive !== false,
    status: p.isActive !== false ? 'Active' : 'Inactive',
    createdAt: p.createdAt,
  };
}

/* ═════════════════════════════════════════════════
   GET /api/products
═════════════════════════════════════════════════ */
export const getProducts = async (req, res, next) => {
  try {
    const {
      search, category, brand, status, minPrice, maxPrice,
      featured, bestSeller, newArrival,
      sort, page = 1, limit = 50,
    } = req.query;

    const query = {};

    // Status filter
    if (status && status !== 'Status') {
      query.isActive = status === 'Active';
    } else if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    // Display filters
    if (featured === 'true') query.featured = true;
    if (bestSeller === 'true') query.isBestSeller = true;
    if (newArrival === 'true') query.isNewArrival = true;

    // Search
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { productCode: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
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

    // Brand filter
    if (brand && brand !== 'Brand') {
      query.brand = { $regex: `^${brand}$`, $options: 'i' };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.sellingPrice = {};
      if (minPrice) query.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
    }

    // Sort
    let sortOptions = { displayOrder: 1, createdAt: -1 };
    if (sort === 'price-low') sortOptions = { sellingPrice: 1 };
    if (sort === 'price-high') sortOptions = { sellingPrice: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };
    if (sort === 'featured') sortOptions = { featured: -1, displayOrder: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortOptions).skip(skip).limit(Number(limit));

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / Number(limit)) || 1,
      currentPage: Number(page),
      data: products.map(formatProduct),
    });
  } catch (error) {
    next(error);
  }
};

/* ═════════════════════════════════════════════════
   GET /api/products/:idOrSlug
═════════════════════════════════════════════════ */
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

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

/* ═════════════════════════════════════════════════
   POST /api/products
═════════════════════════════════════════════════ */
export const createProduct = async (req, res, next) => {
  try {
    const {
      productName, title, slug: reqSlug, productCode, sku,
      sellingType, category, subCategory, brand, unit, description,
      productType, mrp, sellingPrice, price,
      taxType, discountType, discountValue, quantityAlert,
      quantity, stock,
      variantType, attributes: reqAttributes,
      selectedSizes, selectedColours, variants,
      images, colourImages, featuredImage,
      featured, isBestSeller, isNewArrival, displayOrder,
      fabric, careInstructions, specifications, shippingInfo,
      returnPolicy, weight, dimensions, tags,
    } = req.body;

    const finalName = (productName || title || '').trim();
    if (!finalName) {
      return res.status(400).json({ success: false, message: 'Product Name is required' });
    }

    // ── Slug ──
    let finalSlug = reqSlug;
    if (!finalSlug || finalSlug.trim() === '') {
      finalSlug = (
        finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
        '-' + Math.floor(1000 + Math.random() * 9000)
      ).replace(/(^-|-$)/g, '');
    }
    // Ensure unique slug
    const existingSlug = await Product.findOne({ slug: finalSlug });
    if (existingSlug) finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;

    // ── Product Code ──
    let finalCode = (productCode || sku || '').trim();
    if (!finalCode) {
      const count = await Product.countDocuments();
      finalCode = `PT${String(count + 1).padStart(3, '0')}`;
    }
    const existingCode = await Product.findOne({ productCode: finalCode });
    if (existingCode) finalCode = `${finalCode}-${Date.now().toString().slice(-3)}`;

    // ── Category ──
    let catName = '';
    let categoryValue = category || 'General';
    if (category && typeof category === 'string' && category.match(/^[0-9a-fA-F]{24}$/)) {
      const catDoc = await Category.findById(category);
      if (catDoc) {
        catName = catDoc.name;
        categoryValue = catDoc._id;
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

    // ── Pricing ──
    const numMrp = Number(mrp) || Number(price) || 0;
    const numSelling = Number(sellingPrice) || Number(price) || 0;
    const numDiscount = Number(discountValue) || 0;
    const finalDiscountPrice = calcDiscountPrice(numSelling, discountType, numDiscount);
    const finalQuantity = Number(quantity) || Number(stock) || 0;

    // ── Attributes (simple product) ──
    const attributes = reqAttributes || { size: '', colour: '', weight: '', pattern: '', style: '', material: '' };

    // ── Validate variant SKUs are unique ──
    const variantList = Array.isArray(variants) ? variants : [];
    if (variantList.length > 0) {
      const skuSet = new Set();
      for (const v of variantList) {
        if (!v.sku || v.sku.trim() === '') {
          return res.status(400).json({ success: false, message: `Variant ${v.size}/${v.colour} is missing a SKU` });
        }
        if (skuSet.has(v.sku.trim())) {
          return res.status(400).json({ success: false, message: `Duplicate variant SKU: ${v.sku}` });
        }
        skuSet.add(v.sku.trim());
      }
      // Check none conflict with existing products
      const existingVariantSku = await Product.findOne({ 'variants.sku': { $in: [...skuSet] } });
      if (existingVariantSku) {
        return res.status(400).json({ success: false, message: `One or more variant SKUs already exist` });
      }
    }

    // ── Tags ──
    const finalTags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);

    const isActiveValue = req.body.status !== undefined
      ? req.body.status === 'Active'
      : (req.body.isActive !== undefined ? Boolean(req.body.isActive) : true);

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
      brand: brand || '',
      unit: unit || 'Pc',
      description: description || '',
      productType: productType || 'Single Product',
      mrp: numMrp,
      sellingPrice: numSelling,
      price: numSelling || numMrp,
      taxType: taxType || 'GST 5%',
      taxRate: resolveTaxRate(taxType),
      discountType: discountType || 'None',
      discountValue: numDiscount,
      discountPrice: finalDiscountPrice,
      quantity: finalQuantity,
      stock: finalQuantity,
      quantityAlert: Number(quantityAlert) || 5,
      variantType: variantType || 'Single Product',
      attributes,
      selectedSizes: Array.isArray(selectedSizes) ? selectedSizes : [],
      selectedColours: Array.isArray(selectedColours) ? selectedColours : [],
      variants: variantList.map(v => ({
        ...v,
        mrp: Number(v.mrp) || 0,
        sellingPrice: Number(v.sellingPrice) || 0,
        discountValue: Number(v.discountValue) || 0,
        discountPrice: calcDiscountPrice(v.sellingPrice, v.discountType, v.discountValue),
        stock: Number(v.stock) || 0,
        isActive: v.isActive !== false,
      })),
      images: Array.isArray(images) && images.length > 0 ? images : [],
      colourImages: Array.isArray(colourImages) ? colourImages : [],
      featuredImage: featuredImage || (Array.isArray(images) && images.length > 0 ? images[0] : ''),
      featured: Boolean(featured),
      isBestSeller: Boolean(isBestSeller),
      isNewArrival: isNewArrival !== false,
      displayOrder: Number(displayOrder) || 0,
      fabric: fabric || '',
      careInstructions: careInstructions || '',
      specifications: specifications || '',
      shippingInfo: shippingInfo || '',
      returnPolicy: returnPolicy || '',
      weight: weight || '',
      dimensions: dimensions || '',
      tags: finalTags,
      isActive: isActiveValue,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: formatProduct(product),
    });
  } catch (error) {
    next(error);
  }
};

/* ═════════════════════════════════════════════════
   PUT /api/products/:id
═════════════════════════════════════════════════ */
export const updateProduct = async (req, res, next) => {
  try {
    // Re-calculate discount price if pricing fields changed
    if (req.body.sellingPrice !== undefined || req.body.discountType !== undefined || req.body.discountValue !== undefined) {
      const product = await Product.findById(req.params.id);
      if (product) {
        const base = Number(req.body.sellingPrice) || product.sellingPrice || product.price || 0;
        const dtype = req.body.discountType || product.discountType;
        const dval = Number(req.body.discountValue) || product.discountValue || 0;
        req.body.discountPrice = calcDiscountPrice(base, dtype, dval);
        req.body.price = base; // keep alias
      }
    }

    // Recalculate variant discount prices
    if (Array.isArray(req.body.variants)) {
      req.body.variants = req.body.variants.map(v => ({
        ...v,
        discountPrice: calcDiscountPrice(v.sellingPrice, v.discountType, v.discountValue),
      }));
    }

    // Handle tags
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: formatProduct(product) });
  } catch (error) {
    next(error);
  }
};

/* ═════════════════════════════════════════════════
   DELETE /api/products/:id
═════════════════════════════════════════════════ */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.category && typeof product.category === 'string' && product.category.match(/^[0-9a-fA-F]{24}$/)) {
      await Category.findByIdAndUpdate(product.category, { $inc: { itemCount: -1 } });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/* ═════════════════════════════════════════════════
   PATCH /api/products/:id/status
═════════════════════════════════════════════════ */
export const toggleProductStatus = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.isActive = !product.isActive;
    await product.save();
    const statusLabel = product.isActive ? 'Active' : 'Inactive';

    res.json({
      success: true,
      message: `Product marked ${statusLabel}`,
      data: { isActive: product.isActive, status: statusLabel },
    });
  } catch (error) {
    next(error);
  }
};
