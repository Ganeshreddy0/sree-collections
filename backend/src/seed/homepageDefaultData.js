/**
 * Default seed data for all 11 non-exempt homepage sections.
 * Section "featured" (Featured Collection) is intentionally ABSENT — Rule A compliance.
 */
export const defaultHomepageSections = [
  // ─────────────────────────────────────────────────────────
  // 1. HEADER
  // ─────────────────────────────────────────────────────────
  {
    sectionId: 'header',
    displayName: 'Header & Navigation',
    title: 'Sree Collections',
    mediaUrl: '/homepage/logo2_trans.png',
    mediaAlt: 'Sree Collections',
    secondaryMediaUrl: '/homepage/logo2.png',
    secondaryMediaAlt: 'Sree Collections Logo',
    description: 'Celebrating timeless Indian royalty with handpicked silk sarees, designer ethnic sets, and authentic temple jewellery crafted for extraordinary celebrations.',
    ctaText: 'CONTACT US',
    ctaLink: '/contact',
    displayOrder: 1,
    isActive: true,
    items: [
      { itemId: 'nav-home', title: 'Home', linkUrl: '#home', displayOrder: 1, isActive: true },
      { itemId: 'nav-about', title: 'About', linkUrl: '#about', displayOrder: 2, isActive: true },
      { itemId: 'nav-categories', title: 'Categories', linkUrl: '/categories', displayOrder: 3, isActive: true },
      { itemId: 'social-instagram', title: 'Instagram', linkUrl: '#', imageUrl: 'instagram', displayOrder: 1, isActive: true },
      { itemId: 'social-facebook', title: 'Facebook', linkUrl: '#', imageUrl: 'facebook', displayOrder: 2, isActive: true },
      { itemId: 'social-whatsapp', title: 'WhatsApp', linkUrl: '#', imageUrl: 'whatsapp', displayOrder: 3, isActive: true },
      { itemId: 'social-pinterest', title: 'Pinterest', linkUrl: '#', imageUrl: 'pinterest', displayOrder: 4, isActive: true },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 2. HERO SECTION
  // ─────────────────────────────────────────────────────────
  {
    sectionId: 'hero',
    displayName: 'Hero Banner',
    title: 'Dive Into A World Of Endless',
    subtitle: 'Fashion Possibilities',
    description: 'Elevate Your Wardrobe With Our Fashion Finds. Discover Your Signature Style At Fashion Avenue.',
    mediaUrl: '/homepage/hero_col1.png',
    mediaAlt: 'Fashion Model in Coat',
    secondaryMediaUrl: '/homepage/hero_bangles.png',
    secondaryMediaAlt: 'Awesome Gold Jewelry Collection',
    tertiaryMediaUrl: '/homepage/hero_col3.png',
    tertiaryMediaAlt: 'Bridal Jewelry and Sets',
    ctaText: 'SHOP NOW',
    ctaLink: '#featured',
    secondaryCtaText: 'EXPLORE MORE PRODUCTS',
    secondaryCtaLink: '#categories',
    settings: {
      watermarkUrl: '/homepage/sc_crest_watermark_trans.png',
      watermarkAlt: 'SC Crest Watermark',
      bangle_badge_label: 'TRENDING',
      bangle_badge_title: 'Awesome',
      bangle_badge_subtitle: 'Collection',
    },
    displayOrder: 2,
    isActive: true,
    items: [],
  },

  // ─────────────────────────────────────────────────────────
  // NOTE: Section 3 "featured" (Featured Collection) is EXCLUDED per Rule A.
  // It does not exist in this database and is never managed here.
  // ─────────────────────────────────────────────────────────

  // ─────────────────────────────────────────────────────────
  // 4. FREE DELIVERY BANNER
  // ─────────────────────────────────────────────────────────
  {
    sectionId: 'free-delivery',
    displayName: 'Free Delivery Banner',
    title: 'Free Delivery',
    subtitle: '🛍️ Order above $99/-',
    badgeText: 'No Code Required • Worldwide Express Delivery',
    mediaUrl: '/homepage/img4.png',
    mediaAlt: 'Free Express Delivery Truck with Saree & Jewelry',
    displayOrder: 4,
    isActive: true,
    items: [],
  },

  // ─────────────────────────────────────────────────────────
  // 5. CATEGORIES MOSAIC GRID
  // ─────────────────────────────────────────────────────────
  {
    sectionId: 'categories-mosaic',
    displayName: 'Categories Mosaic Grid (Discover By Category)',
    subtitle: 'Discover By Category',
    title: 'Explore Our World of Styles',
    displayOrder: 5,
    isActive: true,
    items: [
      {
        itemId: 'mosaic-denim',
        title: 'Effortless Casuals',
        badge: 'DENIM WEAR',
        imageUrl: '/homepage/mosaic_denim.jpg',
        imageAlt: 'Denim Jeans',
        ctaText: 'Shop Denims',
        linkUrl: '#featured',
        bgColor: '#DDEBEA',
        displayOrder: 1,
        isActive: true,
        metadata: { type: 'left-top', textColor: '#4A6261' },
      },
      {
        itemId: 'mosaic-ethnic',
        title: 'Heritage Elegance',
        badge: 'ETHNIC WEAR',
        imageUrl: '/homepage/mosaic_ethnic.jpg',
        imageAlt: 'Ethnic Wear',
        ctaText: 'Explore Kurtas',
        linkUrl: '#sarees',
        bgColor: '#EFE4E0',
        displayOrder: 2,
        isActive: true,
        metadata: { type: 'left-bottom', textColor: '#7D534A' },
      },
      {
        itemId: 'mosaic-necklace',
        title: 'Royal Gold Jewellery Collection',
        badge: '22K PURE TEMPLE CRAFT',
        imageUrl: '/homepage/mosaic_necklace.jpg',
        imageAlt: 'Royal Gold Jewellery',
        ctaText: 'Explore Jewellery',
        linkUrl: '#featured',
        displayOrder: 3,
        isActive: true,
        metadata: { type: 'right-tall' },
      },
      {
        itemId: 'mosaic-shirt',
        title: 'Everyday Linens',
        badge: 'Minimalist',
        imageUrl: '/homepage/mosaic_shirt.jpg',
        imageAlt: 'Summer Casuals',
        bgColor: '#F2EFE9',
        displayOrder: 4,
        isActive: true,
        metadata: { type: 'bottom-small-left' },
      },
      {
        itemId: 'mosaic-street',
        title: 'Active Wear & Street Style',
        badge: 'URBAN ATELIER',
        description: 'Vibrant hues, modern cuts, and ultimate comfort for every journey.',
        imageUrl: '/homepage/mosaic_street.jpg',
        imageAlt: 'Activewear & Street Style',
        ctaText: 'Shop Street Edit',
        linkUrl: '#featured',
        bgColor: '#D8F0EC',
        displayOrder: 5,
        isActive: true,
        metadata: { type: 'bottom-wide', badgeColor: '#2F5F58' },
      },
      {
        itemId: 'mosaic-decor',
        title: 'Festive Home Decor',
        badge: 'Celebrations',
        imageUrl: '/homepage/mosaic_decor.jpg',
        imageAlt: 'Festive Party Decor',
        bgColor: '#F7F2FA',
        displayOrder: 6,
        isActive: true,
        metadata: { type: 'bottom-small-right' },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 6. EDITORIAL BANNER
  // ─────────────────────────────────────────────────────────
  {
    sectionId: 'editorial-banner',
    displayName: 'Editorial Banner (Your Style / Your Rules)',
    title: 'Your Style',
    subtitle: 'Your Rules',
    description: 'Empower Your Fashion',
    mediaUrl: '/homepage/your_style_pill1_hd.jpg',
    mediaAlt: 'Luxury saree and pearls',
    secondaryMediaUrl: '/homepage/your_style_pill2_hd.jpg',
    secondaryMediaAlt: 'Jewelry display',
    ctaText: 'SHOP NOW',
    ctaLink: '#featured',
    displayOrder: 6,
    isActive: true,
    items: [],
  },

  // ─────────────────────────────────────────────────────────
  // 7. CATEGORY SPOTLIGHT 1: CASUAL WEAR
  // ─────────────────────────────────────────────────────────
  {
    sectionId: 'spotlight-casual',
    displayName: 'Category Spotlight: Casual Wear',
    title: 'Casual Wear',
    subtitle: 'Collections',
    badgeText: 'We consider your look and comfort on scorching weather.',
    description: 'We provide the largest clothing collection for your comfort. You can choose trendy or classy design according to your preferences. Our services are super fast and we update within 24 hours.',
    mediaUrl: '/homepage/casual_model1.jpg',
    mediaAlt: 'Casual Wear Model',
    secondaryMediaUrl: '/homepage/casual_model2.jpg',
    secondaryMediaAlt: 'Casual Pink Outfit',
    tertiaryMediaUrl: '/homepage/casual_model3.jpg',
    tertiaryMediaAlt: 'Denim and Sneakers',
    ctaText: 'Explore',
    ctaLink: '/categories?category=Casual+Wear',
    displayOrder: 7,
    isActive: true,
    settings: {
      layout: 'left-tall',
      secondaryDescription: 'Our main aim is to serve our customer with better quality product. We try to understand their needs and provide them within a short period of time.',
    },
    items: [
      {
        itemId: 'casual-card-1',
        imageUrl: '/homepage/casual_model2.jpg',
        imageAlt: 'Casual fashion',
        displayOrder: 1,
        isActive: true,
        metadata: { width: 200, height: 280 },
      },
      {
        itemId: 'casual-card-2',
        imageUrl: '/homepage/casual_model3.jpg',
        imageAlt: 'Casual styling',
        displayOrder: 2,
        isActive: true,
        metadata: { width: 180, height: 260, marginTop: 28 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 8. CATEGORY SPOTLIGHT 2: SAREE COLLECTIONS
  // ─────────────────────────────────────────────────────────
  {
    sectionId: 'spotlight-saree',
    displayName: 'Category Spotlight: Saree Collections',
    title: 'Saree',
    subtitle: 'Collections',
    badgeText: 'We consider your look and comfort on cold weather.',
    description: 'We provide the largest collection sarees. You can choose trendy or classy design according to your preferences. Our services are super fast and we update within 24 hours.',
    mediaUrl: '/homepage/saree_models.jpg',
    mediaAlt: 'Royal Silk Sarees',
    secondaryMediaUrl: '/homepage/saree_green.jpg',
    secondaryMediaAlt: 'Handcrafted Silk Sarees',
    ctaText: 'Explore',
    ctaLink: '/categories?category=Saree',
    displayOrder: 8,
    isActive: true,
    settings: {
      layout: 'left-overlapping',
      secondaryDescription: 'Our main aim is to serve our customer with better quality product. We try to understand their needs and provide them within a short period of time. We provide the largest clothing collection for any season. You can choose trendy or classy design according to your preferences. Our services are super fast and we update within 24 hours.',
    },
    items: [
      {
        itemId: 'saree-card-1',
        imageUrl: '/homepage/saree_green.jpg',
        imageAlt: 'Silk Saree',
        displayOrder: 1,
        isActive: true,
        metadata: { width: 220, height: 340 },
      },
      {
        itemId: 'saree-card-2',
        imageUrl: '/homepage/saree_models.jpg',
        imageAlt: 'Royal Silk Sarees',
        displayOrder: 2,
        isActive: true,
        metadata: { width: 200, height: 310, marginTop: 36 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 9. CATEGORY SPOTLIGHT 3: DECORATIVE ITEMS
  // ─────────────────────────────────────────────────────────
  {
    sectionId: 'spotlight-decor',
    displayName: 'Category Spotlight: Decorative Items',
    title: 'Decorative Item',
    subtitle: 'Collections',
    badgeText: 'We consider your look and comfort on cold weather.',
    description: 'We provide the largest clothing collection for any season. You can choose trendy or classy design according to your preferences. Our services are super fast and we update within 24 hours.',
    mediaUrl: '/about/stars.jpg',
    mediaAlt: 'Festive Star Lanterns',
    secondaryMediaUrl: '/about/party.jpg',
    secondaryMediaAlt: 'Festive Party Decor',
    ctaText: 'Explore',
    ctaLink: '/categories?category=Decorative+Items',
    displayOrder: 9,
    isActive: true,
    settings: {
      layout: 'right-overlapping',
      secondaryDescription: 'Our main aim is to serve our customer with better quality product. We try to understand their needs and provide them within a short period of time. We provide the largest clothing collection for any season. You can choose trendy or classy design according to your preferences. Our services are super fast and we update within 24 hours.',
    },
    items: [
      {
        itemId: 'decor-card-1',
        imageUrl: '/homepage/decor_lights.jpg',
        imageAlt: 'Festive Decor Diyas',
        displayOrder: 1,
        isActive: true,
        metadata: { width: 220, height: 300 },
      },
      {
        itemId: 'decor-card-2',
        imageUrl: '/homepage/decor_handicraft.jpg',
        imageAlt: 'Artisanal Handicrafts',
        displayOrder: 2,
        isActive: true,
        metadata: { width: 200, height: 280, marginTop: 32 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 10. WHATSAPP SHOPPING BANNER
  // ─────────────────────────────────────────────────────────
  {
    sectionId: 'whatsapp-banner',
    displayName: 'WhatsApp Shopping Banner',
    badgeText: '🛍 Shopping Made Personal',
    title: 'Curate your cart.',
    subtitle: 'Complete on WhatsApp.',
    mediaUrl: '/homepage/img5.png',
    mediaAlt: 'Sree Collections WhatsApp Shopping Bag',
    ctaText: 'Chat on WhatsApp',
    ctaLink: 'https://wa.me/?text=Hello%20Sree%20Collections%2C%20I%20want%20to%20shop!',
    displayOrder: 10,
    isActive: true,
    items: [
      { itemId: 'wa-step-1', title: 'Added Cart', displayOrder: 1, isActive: true },
      { itemId: 'wa-step-2', title: 'WhatsApp', displayOrder: 2, isActive: true },
      { itemId: 'wa-step-3', title: 'Order Confirmed', displayOrder: 3, isActive: true },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 11. CUSTOMER TESTIMONIALS
  // ─────────────────────────────────────────────────────────
  {
    sectionId: 'testimonials',
    displayName: 'Customer Testimonials',
    title: 'Why our Customer says',
    displayOrder: 11,
    isActive: true,
    items: [
      {
        itemId: 'testimonial-1',
        description: 'The silk saree and the temple necklace set I ordered for my sister\'s wedding completely surpassed my expectations. The zari craftsmanship is truly heirloom quality and the luxury packaging made it feel like a royal gift!',
        title: 'Priya Sundaram',
        subtitle: 'Verified Bride',
        badge: 'Chennai, India',
        displayOrder: 1,
        isActive: true,
        metadata: { rating: 5 },
      },
      {
        itemId: 'testimonial-2',
        description: 'Shopping via WhatsApp concierge was the smoothest experience ever. They shared detailed 4K close-up videos of the Banarasi weaves and helped me pick the matching blouse fabric. Exceptional service!',
        title: 'Ananya Deshmukh',
        subtitle: 'Verified Buyer',
        badge: 'Mumbai, India',
        displayOrder: 2,
        isActive: true,
        metadata: { rating: 5 },
      },
      {
        itemId: 'testimonial-3',
        description: 'Ordered from the US and my parcel arrived in just 4 days with pristine packing. The fabric is so soft, breathable, and authentic. Sree Collections has earned a lifelong customer!',
        title: 'Radhika Patel',
        subtitle: 'International Client',
        badge: 'San Jose, USA',
        displayOrder: 3,
        isActive: true,
        metadata: { rating: 5 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 12. FOOTER
  // ─────────────────────────────────────────────────────────
  {
    sectionId: 'footer',
    displayName: 'Footer & Social Links',
    mediaUrl: '/homepage/logo2.png',
    mediaAlt: 'Sree Collections',
    description: 'Celebrating timeless Indian royalty with handpicked silk sarees, designer ethnic sets, and authentic temple jewellery crafted for extraordinary celebrations.',
    displayOrder: 12,
    isActive: true,
    settings: {
      phone: '+91 98765 43210',
      email: 'support@sreecollections.com',
      copyright: 'Sree Collections. All Rights Reserved.',
    },
    items: [
      // Collections links
      { itemId: 'footer-col-1', title: 'Kanjeevaram Pure Silk', linkUrl: '#featured', displayOrder: 1, isActive: true, metadata: { group: 'collections' } },
      { itemId: 'footer-col-2', title: 'Banarasi Heritage Weaves', linkUrl: '#featured', displayOrder: 2, isActive: true, metadata: { group: 'collections' } },
      { itemId: 'footer-col-3', title: 'Bridal Lehengas & Kurtas', linkUrl: '#featured', displayOrder: 3, isActive: true, metadata: { group: 'collections' } },
      { itemId: 'footer-col-4', title: 'Temple Jewellery Sets', linkUrl: '#featured', displayOrder: 4, isActive: true, metadata: { group: 'collections' } },
      { itemId: 'footer-col-5', title: 'Everyday Casuals & Denims', linkUrl: '#featured', displayOrder: 5, isActive: true, metadata: { group: 'collections' } },
      { itemId: 'footer-col-6', title: 'Festive Home Decor', linkUrl: '#featured', displayOrder: 6, isActive: true, metadata: { group: 'collections' } },
      // Customer care links
      { itemId: 'footer-care-1', title: 'Track Your Order', linkUrl: '#home', displayOrder: 1, isActive: true, metadata: { group: 'customer-care' } },
      { itemId: 'footer-care-2', title: 'Shipping & Global Delivery', linkUrl: '#home', displayOrder: 2, isActive: true, metadata: { group: 'customer-care' } },
      { itemId: 'footer-care-3', title: 'Custom Blouse Stitching', linkUrl: '#home', displayOrder: 3, isActive: true, metadata: { group: 'customer-care' } },
      { itemId: 'footer-care-4', title: 'WhatsApp Live Video Call', linkUrl: '#home', displayOrder: 4, isActive: true, metadata: { group: 'customer-care' } },
      { itemId: 'footer-care-5', title: 'Returns & Exchanges', linkUrl: '#home', displayOrder: 5, isActive: true, metadata: { group: 'customer-care' } },
      { itemId: 'footer-care-6', title: 'Authenticity Certificate', linkUrl: '#home', displayOrder: 6, isActive: true, metadata: { group: 'customer-care' } },
    ],
  },
];
