import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sree_collections';

async function run() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  const col = db.collection('homepagesections');
  const section = await col.findOne({ sectionId: 'categories-mosaic' });
  if (!section) {
    console.log('categories-mosaic section not found in DB');
    process.exit(1);
  }

  const updatedItems = (section.items || []).map((item) => {
    if (item.itemId === 'mosaic-denim') {
      return {
        ...item,
        badge: 'DENIM WEAR',
        title: 'Effortless Casuals',
        linkUrl: '/categories?category=Casual%20Wear&subCategory=Denim%20Wear',
        metadata: { ...item.metadata, type: 'left-top', subCategory: 'Denim Wear', category: 'Casual Wear' },
      };
    }
    if (item.itemId === 'mosaic-ethnic') {
      return {
        ...item,
        badge: 'ETHNIC WEAR',
        title: 'Heritage Elegance',
        linkUrl: '/categories?category=Casual%20Wear&subCategory=Ethnic%20Wear',
        metadata: { ...item.metadata, type: 'left-bottom', subCategory: 'Ethnic Wear', category: 'Casual Wear' },
      };
    }
    if (item.itemId === 'mosaic-necklace') {
      return {
        ...item,
        badge: '22K PURE TEMPLE CRAFT',
        title: 'Royal Gold Jewellery Collection',
        linkUrl: '/categories?category=Jewellery&subCategory=Temple%20Jewellery',
        metadata: { ...item.metadata, type: 'right-tall', subCategory: 'Temple Jewellery', category: 'Jewellery' },
      };
    }
    if (item.itemId === 'mosaic-shirt') {
      return {
        ...item,
        badge: 'MINIMALIST',
        title: 'Everyday Linens',
        linkUrl: '/categories?category=Casual%20Wear&subCategory=Everyday%20Linens',
        metadata: { ...item.metadata, type: 'bottom-small-left', subCategory: 'Everyday Linens', category: 'Casual Wear' },
      };
    }
    if (item.itemId === 'mosaic-street') {
      return {
        ...item,
        badge: 'URBAN ATELIER',
        title: 'Active Wear & Street Style',
        linkUrl: '/categories?category=Casual%20Wear&subCategory=Active%20Wear%20%26%20Street%20Style',
        metadata: { ...item.metadata, type: 'bottom-wide', subCategory: 'Active Wear & Street Style', category: 'Casual Wear' },
      };
    }
    if (item.itemId === 'mosaic-decor') {
      return {
        ...item,
        badge: 'CELEBRATIONS',
        title: 'Festive Home Decor',
        linkUrl: '/categories?category=Decorative%20Items&subCategory=Festive%20Home%20Decor',
        metadata: { ...item.metadata, type: 'bottom-small-right', subCategory: 'Festive Home Decor', category: 'Decorative Items' },
      };
    }
    return item;
  });

  await col.updateOne({ sectionId: 'categories-mosaic' }, { $set: { items: updatedItems } });
  console.log('Successfully updated categories-mosaic in MongoDB!');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
