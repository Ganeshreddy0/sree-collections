import Product from '../models/Product.js';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';

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
  const mainImg =
    p.featuredImage ||
    (p.images && p.images.length > 0 ? p.images[0] : '') ||
    '/Categories/product_formal_shirt.jpg';

  return {
    _id: p._id,
    id: p._id.toString(),
    code: p.productCode || p.sku || 'PT000',
    productCode: p.productCode || p.sku,
    name: p.productName || p.title || 'Untitled',
    productName: p.productName || p.title,
    category: p.categoryName || (typeof p.category === 'string' ? p.category : 'General'),
    categoryName: p.categoryName || (typeof p.category === 'string' ? p.category : 'General'),
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
    img: mainImg,
    image: mainImg,
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

/* ─────────────────────────────────────────────────
   Query builder for category, size, price range, etc.
───────────────────────────────────────────────── */
function buildProductFilterQuery(queryParams) {
  const {
    search,
    category,
    categories,
    subCategory,
    brand,
    status,
    isActive,
    size,
    sizes,
    colour,
    color,
    fabric,
    material,
    pattern,
    occasion,
    inStock,
    availability,
    minPrice,
    maxPrice,
    priceRange,
    featured,
    bestSeller,
    newArrival,
  } = queryParams;

  const andConditions = [];

  // 1. Status filter
  if (status && status !== 'Status' && status !== 'all') {
    andConditions.push({ isActive: status === 'Active' });
  } else if (isActive !== undefined && isActive !== '') {
    andConditions.push({ isActive: isActive === 'true' || isActive === true });
  }

  // 2. Display flags
  if (featured === 'true' || featured === true) andConditions.push({ featured: true });
  if (bestSeller === 'true' || bestSeller === true) andConditions.push({ isBestSeller: true });
  if (newArrival === 'true' || newArrival === true) andConditions.push({ isNewArrival: true });

  // 3. Search query
  if (search && search.trim()) {
    const term = search.trim();
    andConditions.push({
      $or: [
        { productName: { $regex: term, $options: 'i' } },
        { title: { $regex: term, $options: 'i' } },
        { productCode: { $regex: term, $options: 'i' } },
        { sku: { $regex: term, $options: 'i' } },
        { brand: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { categoryName: { $regex: term, $options: 'i' } },
        { subCategory: { $regex: term, $options: 'i' } },
        { tags: { $regex: term, $options: 'i' } },
      ],
    });
  }

  // 4. Category filter (supports singular/plural e.g. Saree & Sarees, Casual wear, etc.)
  const catInput = category || categories;
  if (catInput && catInput !== 'All Products' && catInput !== 'all' && catInput !== 'Category') {
    const catList = Array.isArray(catInput)
      ? catInput
      : catInput.split(',').map((c) => c.trim()).filter(Boolean);

    const catOrs = [];
    for (const c of catList) {
      if (c === 'All Products' || c === 'all' || c === 'Category') continue;

      if (typeof c === 'string' && c.match(/^[0-9a-fA-F]{24}$/)) {
        catOrs.push({ category: c });
      } else {
        const clean = c.trim();
        const base = clean.replace(/s$/i, '').trim();
        const escapedClean = clean.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const escapedBase = base.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const catRegex = new RegExp(`(^${escapedClean}$|^${escapedBase}s?$)`, 'i');

        catOrs.push({ categoryName: { $regex: catRegex } });
        catOrs.push({ category: clean });
        catOrs.push({ category: { $regex: catRegex } });

        if (/jewell?ery/i.test(clean)) {
          catOrs.push({ categoryName: { $regex: /jewell?ery/i } });
          catOrs.push({ category: { $regex: /jewell?ery/i } });
        }
      }
    }
    if (catOrs.length > 0) {
      andConditions.push({ $or: catOrs });
    }
  }

  // 5. Subcategory filter
  if (subCategory && subCategory.trim()) {
    andConditions.push({ subCategory: { $regex: `^${subCategory.trim()}$`, $options: 'i' } });
  }

  // 6. Brand filter
  if (brand && brand !== 'Brand' && brand !== 'all') {
    andConditions.push({ brand: { $regex: `^${brand.trim()}$`, $options: 'i' } });
  }

  // 7. Size filter (matches selectedSizes, variants.size, attributes.size)
  const sizeInput = size || sizes;
  if (sizeInput && sizeInput !== 'all') {
    const rawSizes = Array.isArray(sizeInput)
      ? sizeInput
      : sizeInput.split(',').map((s) => s.trim()).filter(Boolean);

    if (rawSizes.length > 0) {
      const sizePatterns = rawSizes.map((s) => new RegExp(`^${s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i'));
      andConditions.push({
        $or: [
          { selectedSizes: { $in: sizePatterns } },
          { 'variants.size': { $in: sizePatterns } },
          { 'attributes.size': { $in: sizePatterns } },
        ],
      });
    }
  }

  // 8. Colour filter
  const colInput = colour || color;
  if (colInput && colInput !== 'all') {
    const rawCols = Array.isArray(colInput)
      ? colInput
      : colInput.split(',').map((c) => c.trim()).filter(Boolean);

    if (rawCols.length > 0) {
      const colPatterns = rawCols.map((c) => new RegExp(`^${c.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i'));
      andConditions.push({
        $or: [
          { selectedColours: { $in: colPatterns } },
          { 'variants.colour': { $in: colPatterns } },
          { 'attributes.colour': { $in: colPatterns } },
          { 'colourImages.colour': { $in: colPatterns } },
        ],
      });
    }
  }

  // 8b. Fabric / material / pattern / occasion (dynamic attribute filters)
  if (fabric && String(fabric).trim() && fabric !== 'all') {
    const fabrics = String(fabric)
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);
    if (fabrics.length > 0) {
      const patterns = fabrics.map(
        (f) => new RegExp(`^${f.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i')
      );
      andConditions.push({
        $or: [{ fabric: { $in: patterns } }, { 'attributes.material': { $in: patterns } }],
      });
    }
  }

  if (material && String(material).trim() && material !== 'all') {
    const materials = String(material)
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);
    if (materials.length > 0) {
      const patterns = materials.map(
        (m) => new RegExp(`^${m.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i')
      );
      andConditions.push({
        $or: [{ 'attributes.material': { $in: patterns } }, { fabric: { $in: patterns } }],
      });
    }
  }

  if (pattern && String(pattern).trim() && pattern !== 'all') {
    const patterns = String(pattern)
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => new RegExp(`^${p.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i'));
    if (patterns.length > 0) {
      andConditions.push({ 'attributes.pattern': { $in: patterns } });
    }
  }

  if (occasion && String(occasion).trim() && occasion !== 'all') {
    const occasions = String(occasion)
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);
    if (occasions.length > 0) {
      const occasionOrs = [];
      for (const o of occasions) {
        const re = new RegExp(o.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
        occasionOrs.push({ tags: re });
        occasionOrs.push({ 'attributes.style': re });
      }
      andConditions.push({ $or: occasionOrs });
    }
  }

  // 8c. Availability / in-stock
  const stockFlag = inStock !== undefined && inStock !== '' ? inStock : availability;
  if (stockFlag === 'true' || stockFlag === true || stockFlag === 'inStock') {
    andConditions.push({
      $or: [
        { stock: { $gt: 0 } },
        { quantity: { $gt: 0 } },
        { 'variants.stock': { $gt: 0 } },
      ],
    });
  } else if (stockFlag === 'false' || stockFlag === 'outOfStock') {
    andConditions.push({
      $and: [
        { $or: [{ stock: { $lte: 0 } }, { stock: { $exists: false } }] },
        { $or: [{ quantity: { $lte: 0 } }, { quantity: { $exists: false } }] },
        {
          $or: [
            { variants: { $size: 0 } },
            { variants: { $exists: false } },
            { variants: { $not: { $elemMatch: { stock: { $gt: 0 } } } } },
          ],
        },
      ],
    });
  }

  // 9. Price Range filter
  const priceRangesToParse = [];
  if (priceRange) {
    const prArray = Array.isArray(priceRange) ? priceRange : priceRange.split(';');
    for (const pr of prArray) {
      if (pr && pr !== 'All Prices') priceRangesToParse.push(pr);
    }
  }

  if (priceRangesToParse.length > 0) {
    const priceRangeOrs = [];
    for (const pr of priceRangesToParse) {
      const clean = pr.replace(/[$,₹]/g, '').replace(/,/g, '').trim();
      let rMin = undefined;
      let rMax = undefined;

      if (/under\s+(\d+(?:\.\d+)?)/i.test(clean)) {
        const m = clean.match(/under\s+(\d+(?:\.\d+)?)/i);
        rMax = Number(m[1]);
      } else if (/above\s+(\d+(?:\.\d+)?)/i.test(clean)) {
        const m = clean.match(/above\s+(\d+(?:\.\d+)?)/i);
        rMin = Number(m[1]);
      } else if (/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/.test(clean)) {
        const m = clean.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
        rMin = Number(m[1]);
        rMax = Number(m[2]);
      }

      if (rMin !== undefined || rMax !== undefined) {
        const cond = {};
        if (rMin !== undefined && !isNaN(rMin)) cond.$gte = rMin;
        if (rMax !== undefined && !isNaN(rMax)) cond.$lte = rMax;
        priceRangeOrs.push({ sellingPrice: cond });
        priceRangeOrs.push({ price: cond });
        priceRangeOrs.push({ 'variants.sellingPrice': cond });
      }
    }
    if (priceRangeOrs.length > 0) {
      andConditions.push({ $or: priceRangeOrs });
    }
  } else if (minPrice !== undefined || maxPrice !== undefined) {
    const cond = {};
    if (minPrice !== undefined && minPrice !== '' && !isNaN(Number(minPrice))) {
      cond.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== '' && !isNaN(Number(maxPrice))) {
      cond.$lte = Number(maxPrice);
    }
    if (Object.keys(cond).length > 0) {
      andConditions.push({
        $or: [
          { sellingPrice: cond },
          { price: cond },
          { 'variants.sellingPrice': cond },
        ],
      });
    }
  }

  return andConditions.length > 0 ? { $and: andConditions } : {};
}

function resolveSortOptions(sort) {
  if (!sort) return { displayOrder: 1, createdAt: -1 };
  const s = String(sort).toLowerCase().trim();
  if (s.includes('low to high') || s === 'price-low' || s === 'price_asc') {
    return { sellingPrice: 1, price: 1 };
  }
  if (s.includes('high to low') || s === 'price-high' || s === 'price_desc') {
    return { sellingPrice: -1, price: -1 };
  }
  if (s.includes('new') || s === 'newest') {
    return { isNewArrival: -1, createdAt: -1 };
  }
  if (s.includes('featured')) {
    return { featured: -1, displayOrder: 1, createdAt: -1 };
  }
  return { displayOrder: 1, createdAt: -1 };
}

/* ═════════════════════════════════════════════════
   GET /api/products
   Full-featured filtering by category, size, price range, search, sort
═════════════════════════════════════════════════ */
export const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, sort } = req.query;
    const query = buildProductFilterQuery(req.query);
    const sortOptions = resolveSortOptions(sort);

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortOptions).skip(skip).limit(Number(limit));

    const formatted = products.map(formatProduct);
    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / Number(limit)) || 1,
      currentPage: Number(page),
      data: formatted,
      products: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/* ═════════════════════════════════════════════════
   GET /api/products/filters
   Returns available category, size, colour, brand, fabric facets
═════════════════════════════════════════════════ */
export const getProductFilterFacets = async (req, res, next) => {
  try {
    const { category } = req.query;

    // Active admin categories (missing status treated as Active for legacy docs)
    const adminCategories = await Category.find({
      $or: [
        { status: 'Active' },
        { status: { $exists: false } },
        { status: null },
        { status: '' },
      ],
    })
      .sort({ featured: -1, name: 1 })
      .lean();

    // Product counts per category name
    const categoriesAggregation = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: {
            $ifNull: ['$categoryName', { $ifNull: ['$category', 'General'] }],
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const countByName = new Map(
      categoriesAggregation.map((c) => [String(c._id).toLowerCase(), c.count])
    );

    const categoriesFromAdmin = adminCategories.map((c) => ({
      name: c.name,
      slug: c.slug,
      count: countByName.get(String(c.name).toLowerCase()) || 0,
      featured: Boolean(c.featured),
    }));

    // Include product-only category names not yet in Category collection
    const adminNameSet = new Set(categoriesFromAdmin.map((c) => c.name.toLowerCase()));
    const orphanCategories = categoriesAggregation
      .filter((c) => c._id && !adminNameSet.has(String(c._id).toLowerCase()))
      .map((c) => ({
        name: String(c._id),
        slug: '',
        count: c.count,
        featured: false,
      }));

    const categories = [...categoriesFromAdmin, ...orphanCategories];

    // Filter active products by category if specified
    const productQuery = { isActive: true };
    if (category && category !== 'All Products' && category !== 'all' && category !== 'Category') {
      const clean = category.trim();
      const base = clean.replace(/s$/i, '').trim();
      const escapedClean = clean.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const escapedBase = base.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const catRegex = new RegExp(`(^${escapedClean}$|^${escapedBase}s?$)`, 'i');

      const catOrs = [
        { categoryName: { $regex: catRegex } },
        { category: clean },
        { category: { $regex: catRegex } },
      ];
      if (/jewell?ery/i.test(clean)) {
        catOrs.push({ categoryName: { $regex: /jewell?ery/i } });
        catOrs.push({ category: { $regex: /jewell?ery/i } });
      }
      productQuery.$or = catOrs;
    }

    const activeProducts = await Product.find(productQuery)
      .select(
        'selectedSizes selectedColours variants attributes fabric brand subCategory sellingPrice price stock quantity'
      )
      .lean();

    const sizeSet = new Set();
    const colourSet = new Set();
    const brandSet = new Set();
    const fabricSet = new Set();
    const patternSet = new Set();
    const subCategorySet = new Set();

    // If category specified, also load subcategories configured under that category
    if (category && category !== 'All Products' && category !== 'all' && category !== 'Category') {
      const activeSubs = await SubCategory.find({
        category: { $regex: new RegExp(`^${category.trim()}$`, 'i') },
        status: 'Active',
      }).lean();
      activeSubs.forEach((s) => s.name && subCategorySet.add(s.name.trim()));
    }
    let minPrice = Infinity;
    let maxPrice = 0;
    let inStockCount = 0;

    activeProducts.forEach((p) => {
      if (Array.isArray(p.selectedSizes)) {
        p.selectedSizes.forEach((s) => s && sizeSet.add(String(s).trim()));
      }
      if (Array.isArray(p.selectedColours)) {
        p.selectedColours.forEach((c) => c && colourSet.add(String(c).trim()));
      }
      if (Array.isArray(p.variants)) {
        p.variants.forEach((v) => {
          if (v.size) sizeSet.add(String(v.size).trim());
          if (v.colour) colourSet.add(String(v.colour).trim());
        });
      }
      if (p.attributes) {
        if (p.attributes.size) sizeSet.add(String(p.attributes.size).trim());
        if (p.attributes.colour) colourSet.add(String(p.attributes.colour).trim());
        if (p.attributes.material) fabricSet.add(String(p.attributes.material).trim());
        if (p.attributes.pattern) patternSet.add(String(p.attributes.pattern).trim());
      }
      if (p.fabric) fabricSet.add(String(p.fabric).trim());
      if (p.brand && p.brand !== '---') brandSet.add(String(p.brand).trim());
      if (p.subCategory) subCategorySet.add(String(p.subCategory).trim());

      const pPrice = Number(p.sellingPrice) || Number(p.price) || 0;
      if (pPrice > 0) {
        if (pPrice < minPrice) minPrice = pPrice;
        if (pPrice > maxPrice) maxPrice = pPrice;
      }
      if (Array.isArray(p.variants)) {
        p.variants.forEach((v) => {
          const vPrice = Number(v.sellingPrice) || Number(v.mrp) || 0;
          if (vPrice > 0) {
            if (vPrice < minPrice) minPrice = vPrice;
            if (vPrice > maxPrice) maxPrice = vPrice;
          }
        });
      }

      const stock =
        Number(p.stock) ||
        Number(p.quantity) ||
        (Array.isArray(p.variants)
          ? p.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
          : 0);
      if (stock > 0) inStockCount += 1;
    });

    if (minPrice === Infinity) minPrice = 0;

    // Sensible INR buckets from live price span
    const priceBuckets =
      maxPrice > 10000
        ? [
            { label: 'All Prices', min: null, max: null },
            { label: 'Under ₹2,000', min: 0, max: 2000 },
            { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
            { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
            { label: 'Above ₹10,000', min: 10000, max: null },
          ]
        : [
            { label: 'All Prices', min: null, max: null },
            { label: 'Under ₹2,000', min: 0, max: 2000 },
            { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
            { label: 'Above ₹5,000', min: 5000, max: null },
          ];

    const payload = {
      categories,
      sizes: Array.from(sizeSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
      colours: Array.from(colourSet).sort((a, b) => a.localeCompare(b)),
      brands: Array.from(brandSet).sort((a, b) => a.localeCompare(b)),
      fabrics: Array.from(fabricSet).sort((a, b) => a.localeCompare(b)),
      patterns: Array.from(patternSet).sort((a, b) => a.localeCompare(b)),
      subCategories: Array.from(subCategorySet).sort((a, b) => a.localeCompare(b)),
      priceRange: { min: minPrice, max: maxPrice },
      priceBuckets,
      availability: {
        inStock: inStockCount,
        total: activeProducts.length,
      },
      totalActiveProducts: activeProducts.length,
    };

    res.json({
      success: true,
      data: payload,
      // Backward-compatible top-level aliases (older clients)
      categories: payload.categories,
      sizes: payload.sizes,
      priceRange: payload.priceRange,
    });
  } catch (error) {
    next(error);
  }
};

/* ═════════════════════════════════════════════════
   GET /api/products/by-category
   Returns products organized by category
═════════════════════════════════════════════════ */
export const getProductsByCategory = async (req, res, next) => {
  try {
    const filterQuery = buildProductFilterQuery({ ...req.query, isActive: true });
    const sortOptions = resolveSortOptions(req.query.sort);

    const products = await Product.find(filterQuery).sort(sortOptions);
    const formatted = products.map(formatProduct);

    const grouped = {};
    formatted.forEach((p) => {
      const cat = p.category || 'Other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    });

    res.json({
      success: true,
      count: formatted.length,
      categoriesCount: Object.keys(grouped).length,
      data: grouped,
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
