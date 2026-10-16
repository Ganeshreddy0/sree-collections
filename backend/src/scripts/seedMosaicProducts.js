import 'dotenv/config';
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';
import Product from '../models/Product.js';
import HomepageSection from '../models/HomepageSection.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sreecollections';

const subCategoriesData = [
  { name: 'Denim Wear', category: 'Casual Wear', slug: 'denim-wear' },
  { name: 'Ethnic Wear', category: 'Casual Wear', slug: 'ethnic-wear' },
  { name: 'Temple Jewellery', category: 'Jewellery', slug: 'temple-jewellery' },
  { name: 'Everyday Linens', category: 'Casual Wear', slug: 'everyday-linens' },
  { name: 'Active Wear & Street Style', category: 'Casual Wear', slug: 'active-wear-street-style' },
  { name: 'Festive Home Decor', category: 'Decorative Items', slug: 'festive-home-decor' },
];

const productsData = [
  // ── 1. DENIM WEAR (5 Products) ─────────────────────────
  {
    productName: 'Vintage Distressed Slim Fit Jeans',
    subCategory: 'Denim Wear',
    categoryName: 'Casual Wear',
    brand: 'Zara',
    productCode: 'DNM-001',
    sku: 'DNM-001',
    mrp: 2999,
    sellingPrice: 1899,
    stock: 75,
    quantity: 75,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    ],
    description: 'Mid-rise distressed stretch denim jeans with handcrafted abrasions, vintage blue wash fade, and reinforced stitch seams for all-day comfort.',
    selectedSizes: ['28', '30', '32', '34', '36'],
    selectedColours: ['Blue', 'Light Blue'],
    attributes: { material: '98% Cotton, 2% Elastane', style: 'Slim Fit', pattern: 'Distressed' },
    fabric: 'Stretch Cotton Denim',
    tags: ['denim', 'jeans', 'casual', 'distressed', 'slim fit'],
    featured: true,
  },
  {
    productName: 'High-Rise Wide Leg Flared Denim',
    subCategory: 'Denim Wear',
    categoryName: 'Casual Wear',
    brand: 'Zara',
    productCode: 'DNM-002',
    sku: 'DNM-002',
    mrp: 3499,
    sellingPrice: 2299,
    stock: 60,
    quantity: 60,
    images: [
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    ],
    description: 'Retro 90s-inspired high-waisted wide leg denim trousers with an elongated clean silhouette and structured ocean wash finish.',
    selectedSizes: ['26', '28', '30', '32'],
    selectedColours: ['Blue', 'Dark Navy'],
    attributes: { material: '100% Rigid Denim', style: 'Wide Leg', pattern: 'Solid' },
    fabric: 'Pure Cotton Denim',
    tags: ['denim', 'wide leg', 'high rise', 'retro', 'streetwear'],
    isBestSeller: true,
  },
  {
    productName: 'Classic Washed Denim Trucker Jacket',
    subCategory: 'Denim Wear',
    categoryName: 'Casual Wear',
    brand: 'Zara',
    productCode: 'DNM-003',
    sku: 'DNM-003',
    mrp: 4199,
    sellingPrice: 2799,
    stock: 45,
    quantity: 45,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
    ],
    description: 'Relaxed-fit heavy cotton trucker denim jacket with brass button placket, dual flap chest pockets, and adjustable waist tabs.',
    selectedSizes: ['S', 'M', 'L', 'XL'],
    selectedColours: ['Faded Blue', 'Black'],
    attributes: { material: 'Heavyweight Cotton Denim', style: 'Trucker Jacket', pattern: 'Solid' },
    fabric: '100% Cotton Denim',
    tags: ['jacket', 'denim jacket', 'outerwear', 'layering'],
  },
  {
    productName: 'Ankle Crop Tapered Stretch Jeans',
    subCategory: 'Denim Wear',
    categoryName: 'Casual Wear',
    brand: 'Zara',
    productCode: 'DNM-004',
    sku: 'DNM-004',
    mrp: 3199,
    sellingPrice: 1999,
    stock: 90,
    quantity: 90,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    ],
    description: 'Everyday effortless dark indigo jeans with flexible comfort stretch denim, clean contrast stitching, and modern ankle-length crop.',
    selectedSizes: ['30', '32', '34', '36'],
    selectedColours: ['Dark Blue', 'Black'],
    attributes: { material: 'Cotton Spandex', style: 'Tapered Ankle Crop', pattern: 'Clean Solid' },
    fabric: 'Stretch Denim',
    tags: ['jeans', 'indigo', 'tapered', 'casual'],
  },
  {
    productName: 'Relaxed Boyfriend Denim Dungarees',
    subCategory: 'Denim Wear',
    categoryName: 'Casual Wear',
    brand: 'Zara',
    productCode: 'DNM-005',
    sku: 'DNM-005',
    mrp: 3899,
    sellingPrice: 2499,
    stock: 35,
    quantity: 35,
    images: [
      'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&q=80',
    ],
    description: 'Laid-back slouchy denim overalls featuring adjustable metal buckle suspenders, utility kangaroo chest pockets, and relaxed boyfriend hems.',
    selectedSizes: ['S', 'M', 'L'],
    selectedColours: ['Light Blue Wash'],
    attributes: { material: '100% Cotton Denim', style: 'Dungaree Overalls', pattern: 'Solid Wash' },
    fabric: 'Denim',
    tags: ['dungaree', 'overalls', 'denim', 'relaxed', 'casual'],
  },

  // ── 2. ETHNIC WEAR (5 Products) ────────────────────────
  {
    productName: 'Royal Chanderi Silk Embroidered Kurta Set',
    subCategory: 'Ethnic Wear',
    categoryName: 'Casual Wear',
    brand: 'Chanderi',
    productCode: 'ETH-001',
    sku: 'ETH-001',
    mrp: 5299,
    sellingPrice: 3499,
    stock: 50,
    quantity: 50,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
    ],
    description: 'Hand-embroidered resham and zari work Chanderi silk straight kurta with matching cigarette pants and sheer organza dupatta.',
    selectedSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    selectedColours: ['Maroon', 'Gold'],
    attributes: { material: 'Chanderi Silk', style: 'Straight Kurta Set', pattern: 'Zari Embroidery' },
    fabric: 'Chanderi Silk',
    tags: ['ethnic', 'kurta', 'chanderi', 'festive', 'zari'],
    featured: true,
  },
  {
    productName: 'Angrakha Pure Silk Flared Anarkali',
    subCategory: 'Ethnic Wear',
    categoryName: 'Casual Wear',
    brand: 'Chanderi',
    productCode: 'ETH-002',
    sku: 'ETH-002',
    mrp: 6499,
    sellingPrice: 4299,
    stock: 40,
    quantity: 40,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    ],
    description: 'Regal wine red pure silk flared angrakha kurta styled with intricate gota patti borders, tie-up dori tassels, and gold foil motifs.',
    selectedSizes: ['M', 'L', 'XL'],
    selectedColours: ['Red', 'Wine'],
    attributes: { material: 'Pure Silk', style: 'Angrakha Anarkali', pattern: 'Gota Patti' },
    fabric: 'Pure Silk',
    tags: ['anarkali', 'angrakha', 'silk', 'wedding', 'festive'],
    isBestSeller: true,
  },
  {
    productName: 'Pastel Lucknowi Chikankari Georgette Kurti',
    subCategory: 'Ethnic Wear',
    categoryName: 'Casual Wear',
    brand: 'Chanderi',
    productCode: 'ETH-003',
    sku: 'ETH-003',
    mrp: 3999,
    sellingPrice: 2699,
    stock: 65,
    quantity: 65,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80',
    ],
    description: 'Authentic handmade shadow work Chikankari long kurti accented with delicate mukaish embellishments and tone-on-tone embroidery.',
    selectedSizes: ['S', 'M', 'L', 'XL'],
    selectedColours: ['Pink', 'Cream'],
    attributes: { material: 'Georgette', style: 'Long Kurti', pattern: 'Chikankari Handwork' },
    fabric: 'Georgette with Cotton Inner',
    tags: ['chikankari', 'lucknowi', 'kurti', 'pastel', 'georgette'],
  },
  {
    productName: 'Banarasi Brocade Festive Straight Tunic',
    subCategory: 'Ethnic Wear',
    categoryName: 'Casual Wear',
    brand: 'Pochampally',
    productCode: 'ETH-004',
    sku: 'ETH-004',
    mrp: 4899,
    sellingPrice: 3199,
    stock: 55,
    quantity: 55,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&q=80',
    ],
    description: 'Jewel-tone Banarasi woven brocade kurta with jewel boat neckline, royal gold zari weaving, side slits, and satin lining.',
    selectedSizes: ['M', 'L', 'XL', 'XXL'],
    selectedColours: ['Purple', 'Green'],
    attributes: { material: 'Banarasi Brocade', style: 'Straight Tunic', pattern: 'Woven Floral Jaal' },
    fabric: 'Banarasi Brocade Silk',
    tags: ['banarasi', 'brocade', 'tunic', 'ethnic', 'festive'],
  },
  {
    productName: 'Mirror Work Bandhani Kurta Sharara Set',
    subCategory: 'Ethnic Wear',
    categoryName: 'Casual Wear',
    brand: 'Chanderi',
    productCode: 'ETH-005',
    sku: 'ETH-005',
    mrp: 7299,
    sellingPrice: 4899,
    stock: 30,
    quantity: 30,
    images: [
      'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80',
    ],
    description: 'Vibrant traditional tie-dye bandhani kurta paired with layered tiered flare sharara and real glass mirror border work.',
    selectedSizes: ['S', 'M', 'L', 'XL'],
    selectedColours: ['Yellow', 'Orange'],
    attributes: { material: 'Georgette Silk', style: 'Sharara Set', pattern: 'Bandhani Mirror Work' },
    fabric: 'Art Silk Bandhani',
    tags: ['bandhani', 'sharara', 'mirror work', 'celebration'],
  },

  // ── 3. TEMPLE JEWELLERY (5 Products) ───────────────────
  {
    productName: '22K Gold Antique Lakshmi Temple Choker',
    subCategory: 'Temple Jewellery',
    categoryName: 'Jewellery',
    brand: 'Caratlane',
    productCode: 'TMP-001',
    sku: 'TMP-001',
    mrp: 12999,
    sellingPrice: 8499,
    stock: 25,
    quantity: 25,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    ],
    description: 'Heritage matte antique finish 22k gold plated temple choker necklace with Goddess Lakshmi centerpiece, ruby red stone drops, and adjustable dori.',
    selectedSizes: ['Standard'],
    selectedColours: ['Gold', 'Red'],
    attributes: { material: 'Brass with 22K Antique Gold Plating', style: 'Temple Choker', pattern: 'Goddess Lakshmi Carving' },
    tags: ['jewellery', 'temple jewellery', 'gold choker', 'lakshmi', 'bridal'],
    featured: true,
  },
  {
    productName: 'South Indian Kempu Stone Long Temple Haar',
    subCategory: 'Temple Jewellery',
    categoryName: 'Jewellery',
    brand: 'Caratlane',
    productCode: 'TMP-002',
    sku: 'TMP-002',
    mrp: 17999,
    sellingPrice: 11999,
    stock: 20,
    quantity: 20,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    ],
    description: 'Opulent multi-layered temple haar crafted with authentic red-green kempu cabochons, freshwater pearl tassels, and peacock carvings.',
    selectedSizes: ['Standard'],
    selectedColours: ['Gold', 'Green'],
    attributes: { material: '22K Matte Micro Gold Plated', style: 'Long Haar Necklace', pattern: 'Peacock & Kemp Stones' },
    tags: ['haar', 'temple jewellery', 'kempu', 'south indian', 'necklace'],
    isBestSeller: true,
  },
  {
    productName: 'Peacock Temple Jhumka Earrings with Hair Chains',
    subCategory: 'Temple Jewellery',
    categoryName: 'Jewellery',
    brand: 'Caratlane',
    productCode: 'TMP-003',
    sku: 'TMP-003',
    mrp: 5999,
    sellingPrice: 3899,
    stock: 45,
    quantity: 45,
    images: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&q=80',
    ],
    description: 'Traditional temple jhumkas featuring majestic peacock studs, bell-shaped hanging drops with pearl clusters, and hair devasena mattal chains.',
    selectedSizes: ['Standard'],
    selectedColours: ['Gold', 'Red'],
    attributes: { material: 'Copper Alloy, 22K Antique Gold', style: 'Jhumka with Mattal', pattern: 'Peacock Bell Drop' },
    tags: ['jhumka', 'earrings', 'temple craft', 'peacock', 'gold'],
  },
  {
    productName: 'Royal Mango Mala (Manga Malai) Temple Necklace',
    subCategory: 'Temple Jewellery',
    categoryName: 'Jewellery',
    brand: 'Caratlane',
    productCode: 'TMP-004',
    sku: 'TMP-004',
    mrp: 14500,
    sellingPrice: 9799,
    stock: 18,
    quantity: 18,
    images: [
      'https://images.unsplash.com/photo-1611591475152-478311382490?w=800&q=80',
    ],
    description: 'Iconic traditional south Indian mango motif gold-crafted necklace accented with emerald green stones and fine micro-pearl trims.',
    selectedSizes: ['Standard'],
    selectedColours: ['Gold', 'Emerald Green'],
    attributes: { material: '22K Gold Finish Alloy', style: 'Manga Malai', pattern: 'Mango Paisley' },
    tags: ['manga malai', 'necklace', 'temple jewellery', 'heritage'],
  },
  {
    productName: 'Antique Temple Vanki & Kada Bangle Set',
    subCategory: 'Temple Jewellery',
    categoryName: 'Jewellery',
    brand: 'Caratlane',
    productCode: 'TMP-005',
    sku: 'TMP-005',
    mrp: 9999,
    sellingPrice: 6499,
    stock: 35,
    quantity: 35,
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80',
    ],
    description: 'Hand-carved bridal antique gold temple kada bangle pair with intricate floral filigree, ruby stone accents, and secure screw-lock clasp.',
    selectedSizes: ['2.4', '2.6', '2.8'],
    selectedColours: ['Gold'],
    attributes: { material: '22K Antique Gold Plated', style: 'Kada Bangles', pattern: 'Filigree & Ruby' },
    tags: ['bangles', 'kada', 'vanki', 'temple jewellery', 'gold'],
  },

  // ── 4. EVERYDAY LINENS (5 Products) ────────────────────
  {
    productName: 'Minimalist Pure Linen Mandarin Collar Shirt',
    subCategory: 'Everyday Linens',
    categoryName: 'Casual Wear',
    brand: 'Zara',
    productCode: 'LIN-001',
    sku: 'LIN-001',
    mrp: 2699,
    sellingPrice: 1799,
    stock: 80,
    quantity: 80,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    ],
    description: 'Breathable 100% European flax pure linen casual shirt with mandarin band collar, clean curved hem, and genuine mother-of-pearl buttons.',
    selectedSizes: ['S', 'M', 'L', 'XL'],
    selectedColours: ['White', 'Beige'],
    attributes: { material: '100% Pure Flax Linen', style: 'Mandarin Shirt', pattern: 'Solid Natural Slub' },
    fabric: 'Pure Flax Linen',
    tags: ['linen', 'shirt', 'minimalist', 'summer', 'breathable'],
    featured: true,
  },
  {
    productName: 'Relaxed Fit Linen Straight Pants with Drawstring',
    subCategory: 'Everyday Linens',
    categoryName: 'Casual Wear',
    brand: 'Zara',
    productCode: 'LIN-002',
    sku: 'LIN-002',
    mrp: 2999,
    sellingPrice: 1999,
    stock: 70,
    quantity: 70,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
    ],
    description: 'Easy-going minimalist off-white pure linen trousers featuring an elasticated drawstring waistband and roomy slant pockets for vacation ease.',
    selectedSizes: ['28', '30', '32', '34', '36'],
    selectedColours: ['Beige', 'Cream', 'Olive'],
    attributes: { material: '100% Washed Linen', style: 'Drawstring Trouser', pattern: 'Solid' },
    fabric: 'Pure Washed Linen',
    tags: ['linen', 'trousers', 'minimalist', 'lounge', 'straight pants'],
    isBestSeller: true,
  },
  {
    productName: 'Breezy Linen Kaftan Tunic',
    subCategory: 'Everyday Linens',
    categoryName: 'Casual Wear',
    brand: 'Zara',
    productCode: 'LIN-003',
    sku: 'LIN-003',
    mrp: 3299,
    sellingPrice: 2199,
    stock: 50,
    quantity: 50,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    ],
    description: 'Earthy sage green relaxed linen kaftan tunic with subtle vertical pintuck detailing, V-neckline, and airy side slits.',
    selectedSizes: ['Free Size'],
    selectedColours: ['Green', 'Sage Green'],
    attributes: { material: 'Organic Linen', style: 'Kaftan Tunic', pattern: 'Pintuck' },
    fabric: 'Organic Linen',
    tags: ['kaftan', 'tunic', 'linen', 'minimalist', 'breezy'],
  },
  {
    productName: 'Minimalist Linen Co-ord Lounge Set',
    subCategory: 'Everyday Linens',
    categoryName: 'Casual Wear',
    brand: 'Zara',
    productCode: 'LIN-004',
    sku: 'LIN-004',
    mrp: 4999,
    sellingPrice: 3299,
    stock: 45,
    quantity: 45,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    ],
    description: 'Coordinated oatmeal beige linen button-down short sleeve resort top with matching cropped wide-leg lounge trousers.',
    selectedSizes: ['S', 'M', 'L'],
    selectedColours: ['Beige', 'Sand'],
    attributes: { material: 'Pure Linen', style: 'Co-ord Set', pattern: 'Natural Slub' },
    fabric: 'Linen Slub',
    tags: ['co-ord', 'lounge', 'linen', 'minimalist', 'neutral'],
  },
  {
    productName: 'Tailored Linen Blend Sleeveless Waistcoat',
    subCategory: 'Everyday Linens',
    categoryName: 'Casual Wear',
    brand: 'Zara',
    productCode: 'LIN-005',
    sku: 'LIN-005',
    mrp: 2499,
    sellingPrice: 1699,
    stock: 60,
    quantity: 60,
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
    ],
    description: 'Sleek tailored minimalist linen vest waistcoat designed for effortless summer layering over wide trousers, linens, and breezy skirts.',
    selectedSizes: ['XS', 'S', 'M', 'L'],
    selectedColours: ['Cream', 'White'],
    attributes: { material: 'Linen Viscose Blend', style: 'Sleeveless Vest', pattern: 'Solid Tailored' },
    fabric: 'Linen Blend',
    tags: ['waistcoat', 'vest', 'linen', 'minimalist', 'chic'],
  },

  // ── 5. ACTIVE WEAR & STREET STYLE (5 Products) ─────────
  {
    productName: 'Urban Oversized Streetwear Fleece Hoodie',
    subCategory: 'Active Wear & Street Style',
    categoryName: 'Casual Wear',
    brand: 'Zara',
    productCode: 'STR-001',
    sku: 'STR-001',
    mrp: 3799,
    sellingPrice: 2499,
    stock: 85,
    quantity: 85,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    ],
    description: 'Heavyweight 400 GSM premium cotton fleece oversized hoodie in radiant vibrant yellow with dropped shoulders, double-lined hood, and kangaroo pouch.',
    selectedSizes: ['S', 'M', 'L', 'XL'],
    selectedColours: ['Yellow', 'Black'],
    attributes: { material: '400 GSM Combed Cotton Fleece', style: 'Oversized Hoodie', pattern: 'Solid Graphic' },
    fabric: 'Heavy Cotton Fleece',
    tags: ['hoodie', 'streetwear', 'yellow', 'oversized', 'urban atelier'],
    featured: true,
  },
  {
    productName: 'High-Waist Performance Ribbed Leggings',
    subCategory: 'Active Wear & Street Style',
    categoryName: 'Casual Wear',
    brand: 'Zara',
    productCode: 'STR-002',
    sku: 'STR-002',
    mrp: 2399,
    sellingPrice: 1599,
    stock: 95,
    quantity: 95,
    images: [
      'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=800&q=80',
    ],
    description: 'Four-way stretch moisture-wicking seamless high-waist athletic leggings built for workout performance and street activewear styling.',
    selectedSizes: ['XS', 'S', 'M', 'L'],
    selectedColours: ['Black', 'Grey', 'Navy'],
    attributes: { material: '80% Nylon, 20% Spandex', style: 'Seamless Leggings', pattern: 'Ribbed Texture' },
    fabric: 'Performance Spandex',
    tags: ['leggings', 'activewear', 'gym', 'workout', 'high waist'],
    isBestSeller: true,
  },
  {
    productName: 'Retro Streetwear Cargo Track Joggers',
    subCategory: 'Active Wear & Street Style',
    categoryName: 'Casual Wear',
    brand: 'Zara',
    productCode: 'STR-003',
    sku: 'STR-003',
    mrp: 3299,
    sellingPrice: 2199,
    stock: 65,
    quantity: 65,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
    ],
    description: 'Utilitarian cargo track joggers with multiple bellows pockets, elasticized bungee ankle cuffs, and quick-dry technical nylon fabric.',
    selectedSizes: ['S', 'M', 'L', 'XL'],
    selectedColours: ['Yellow', 'Black', 'Olive'],
    attributes: { material: 'Polyester Ripstop Nylon', style: 'Cargo Track Pants', pattern: 'Tactical Cargo' },
    fabric: 'Technical Ripstop',
    tags: ['joggers', 'track pants', 'cargo', 'streetwear', 'active'],
  },
  {
    productName: 'Cropped Activewear Zip-Up Windbreaker Jacket',
    subCategory: 'Active Wear & Street Style',
    categoryName: 'Casual Wear',
    brand: 'Zara',
    productCode: 'STR-004',
    sku: 'STR-004',
    mrp: 3999,
    sellingPrice: 2699,
    stock: 50,
    quantity: 50,
    images: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
    ],
    description: 'Lightweight water-resistant cropped windbreaker sports jacket with stand-up storm collar, contrast zipper, and toggle bungee cinch hem.',
    selectedSizes: ['S', 'M', 'L'],
    selectedColours: ['White', 'Yellow', 'Black'],
    attributes: { material: 'Water Repellent Nylon', style: 'Cropped Windbreaker', pattern: 'Colourblock' },
    fabric: 'Windproof Nylon',
    tags: ['jacket', 'windbreaker', 'crop jacket', 'sportswear'],
  },
  {
    productName: 'Boxy Graphic Heavyweight Street Crewneck Tee',
    subCategory: 'Active Wear & Street Style',
    categoryName: 'Casual Wear',
    brand: 'Zara',
    productCode: 'STR-005',
    sku: 'STR-005',
    mrp: 1999,
    sellingPrice: 1299,
    stock: 120,
    quantity: 120,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
    ],
    description: 'Urban atelier typography print boxy fit crewneck t-shirt in thick 240 GSM combed organic cotton with rib knit collar.',
    selectedSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    selectedColours: ['Black', 'White'],
    attributes: { material: '240 GSM Combed Cotton', style: 'Boxy Street Tee', pattern: 'Graphic Typography' },
    fabric: '100% Combed Cotton',
    tags: ['t-shirt', 'streetwear', 'tee', 'urban', 'graphic'],
  },

  // ── 6. FESTIVE HOME DECOR (5 Products) ─────────────────
  {
    productName: 'Handcrafted Brass Peacock Urli with Floating Diyas',
    subCategory: 'Festive Home Decor',
    categoryName: 'Decorative Items',
    brand: 'Sree Atelier',
    productCode: 'DEC-001',
    sku: 'DEC-001',
    mrp: 3999,
    sellingPrice: 2499,
    stock: 35,
    quantity: 35,
    images: [
      'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=800&q=80',
    ],
    description: 'Traditional engraved pure brass peacock urli bowl with ornate dual handles, designed for floating fresh flower petals and tealight diyas.',
    selectedSizes: ['12 Inch', '14 Inch'],
    selectedColours: ['Gold'],
    attributes: { material: 'Pure Solid Brass', style: 'Urli Bowl', pattern: 'Peacock Engraving' },
    tags: ['home decor', 'urli', 'brass', 'diwali', 'pooja', 'festive'],
    featured: true,
  },
  {
    productName: 'Traditional Handpainted Akhand Jyot Brass Diya Set',
    subCategory: 'Festive Home Decor',
    categoryName: 'Decorative Items',
    brand: 'Sree Atelier',
    productCode: 'DEC-002',
    sku: 'DEC-002',
    mrp: 1999,
    sellingPrice: 1299,
    stock: 80,
    quantity: 80,
    images: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
    ],
    description: 'Set of 4 intricately engraved festive brass oil diyas with heat-resistant borosilicate glass chimneys for sacred celebrations and prayer rooms.',
    selectedSizes: ['Set of 4'],
    selectedColours: ['Gold', 'Amber'],
    attributes: { material: 'Brass & Borosilicate Glass', style: 'Akhand Diya', pattern: 'Floral Engraved' },
    tags: ['diya', 'lamp', 'brass diya', 'puja', 'festive home decor'],
    isBestSeller: true,
  },
  {
    productName: 'Marigold Floral Gota Toran & Door Hanging',
    subCategory: 'Festive Home Decor',
    categoryName: 'Decorative Items',
    brand: 'Sree Atelier',
    productCode: 'DEC-003',
    sku: 'DEC-003',
    mrp: 1499,
    sellingPrice: 899,
    stock: 90,
    quantity: 90,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    ],
    description: 'Handcrafted entryway decorative door toran with lush faux saffron marigold blossoms, golden gota patti work, and auspicious ringing brass bells.',
    selectedSizes: ['38 Inch Length'],
    selectedColours: ['Orange', 'Yellow', 'Gold'],
    attributes: { material: 'Fabric, Gota & Brass Bells', style: 'Door Toran Bandhanwar', pattern: 'Marigold Garland' },
    tags: ['toran', 'door hanging', 'marigold', 'entrance decor', 'festive'],
  },
  {
    productName: 'Traditional Wooden Rangoli Floor Art Template with Colors',
    subCategory: 'Festive Home Decor',
    categoryName: 'Decorative Items',
    brand: 'Sree Atelier',
    productCode: 'DEC-004',
    sku: 'DEC-004',
    mrp: 2299,
    sellingPrice: 1499,
    stock: 55,
    quantity: 55,
    images: [
      'https://images.unsplash.com/photo-1574870111867-089730e5a72b?w=800&q=80',
    ],
    description: 'Laser-cut reusable MDF wood peacock rangoli floor stencil template accompanied by 6 jars of natural non-toxic vibrant rangoli color powders.',
    selectedSizes: ['18x18 Inch'],
    selectedColours: ['Multi-color'],
    attributes: { material: 'MDF Wood & Natural Colors', style: 'Rangoli Template', pattern: 'Mandala Peacock' },
    tags: ['rangoli', 'diwali', 'floor art', 'decor', 'festive'],
  },
  {
    productName: 'Hanging Brass Temple Bell with Chain & Bird Crest',
    subCategory: 'Festive Home Decor',
    categoryName: 'Decorative Items',
    brand: 'Sree Atelier',
    productCode: 'DEC-005',
    sku: 'DEC-005',
    mrp: 2899,
    sellingPrice: 1899,
    stock: 40,
    quantity: 40,
    images: [
      'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=800&q=80',
    ],
    description: 'Deep resonant solid cast brass auspicious hanging ghanti bell with handcrafted parrot finial crest and heavy antique link suspension chain.',
    selectedSizes: ['24 Inch Total Height'],
    selectedColours: ['Antique Brass'],
    attributes: { material: 'Solid Cast Brass', style: 'Hanging Bell Ghanti', pattern: 'Temple Carving' },
    tags: ['bell', 'brass bell', 'hanging decor', 'temple', 'mandir'],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to MongoDB');

    // 1. Fetch categories
    const categories = await Category.find({});
    const catMap = {};
    for (const c of categories) {
      catMap[c.name] = c._id;
    }
    console.log('[Seed] Found categories:', Object.keys(catMap));

    // 2. Insert or update SubCategories
    console.log('\n[Seed] Updating SubCategories...');
    for (const sc of subCategoriesData) {
      const existing = await SubCategory.findOne({ name: sc.name });
      if (existing) {
        existing.category = sc.category;
        existing.status = 'Active';
        await existing.save();
        console.log(`  ✓ Updated subcategory: "${sc.name}" (${sc.category})`);
      } else {
        await SubCategory.create({
          name: sc.name,
          category: sc.category,
          slug: sc.slug,
          status: 'Active',
        });
        console.log(`  + Created subcategory: "${sc.name}" (${sc.category})`);
      }
    }

    // 3. Insert or update Products
    console.log('\n[Seed] Inserting/updating Products (5 per subcategory)...');
    let insertedCount = 0;
    let updatedCount = 0;

    for (const p of productsData) {
      const categoryId = catMap[p.categoryName] || catMap['Casual Wear'];
      const slug = p.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const productPayload = {
        productName: p.productName,
        title: p.productName,
        slug,
        productCode: p.productCode,
        sku: p.sku,
        sellingType: 'B2C',
        category: categoryId,
        categoryName: p.categoryName,
        subCategory: p.subCategory,
        brand: p.brand,
        unit: 'Pc',
        description: p.description,
        productType: 'Single Product',
        variantType: 'Single Product',
        mrp: p.mrp,
        sellingPrice: p.sellingPrice,
        price: p.sellingPrice,
        taxType: 'GST 5%',
        taxRate: 5,
        discountType: 'None',
        discountValue: 0,
        discountPrice: null,
        quantity: p.quantity,
        stock: p.stock,
        quantityAlert: 5,
        selectedSizes: p.selectedSizes || [],
        selectedColours: p.selectedColours || [],
        attributes: p.attributes || {},
        fabric: p.fabric || '',
        tags: p.tags || [],
        images: p.images || [],
        featuredImage: p.images && p.images.length > 0 ? p.images[0] : '',
        featured: !!p.featured,
        isBestSeller: !!p.isBestSeller,
        isNewArrival: true,
        isActive: true,
      };

      const existingProd = await Product.findOne({
        $or: [{ productCode: p.productCode }, { slug }],
      });

      if (existingProd) {
        Object.assign(existingProd, productPayload);
        await existingProd.save();
        updatedCount++;
        console.log(`  ↻ Updated product: [${p.productCode}] ${p.productName}`);
      } else {
        await Product.create(productPayload);
        insertedCount++;
        console.log(`  + Created product: [${p.productCode}] ${p.productName}`);
      }
    }

    console.log(`\n[Seed] Finished! Inserted: ${insertedCount}, Updated: ${updatedCount}`);

    // 4. Update categories-mosaic item links in HomepageSection
    const mosaicSection = await HomepageSection.findOne({ sectionId: 'categories-mosaic' });
    if (mosaicSection && Array.isArray(mosaicSection.items)) {
      const linkMap = {
        'mosaic-denim': '/categories?subCategory=Denim+Wear',
        'mosaic-ethnic': '/categories?subCategory=Ethnic+Wear',
        'mosaic-necklace': '/categories?subCategory=Temple+Jewellery',
        'mosaic-shirt': '/categories?subCategory=Everyday+Linens',
        'mosaic-street': '/categories?subCategory=Active+Wear+%26+Street+Style',
        'mosaic-decor': '/categories?subCategory=Festive+Home+Decor',
      };

      let changed = false;
      for (const item of mosaicSection.items) {
        if (linkMap[item.itemId]) {
          item.linkUrl = linkMap[item.itemId];
          changed = true;
        }
      }

      if (changed) {
        await mosaicSection.save();
        console.log('[Seed] Updated Homepage categories-mosaic card links to point to subcategory pages!');
      }
    }

    await mongoose.disconnect();
    console.log('[Seed] Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
}

seed();
