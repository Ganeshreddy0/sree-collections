import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';
import Brand from '../models/Brand.js';
import VariantAttribute from '../models/VariantAttribute.js';
import Product from '../models/Product.js';
import {
  initialCategories,
  initialSubCategories,
  initialBrands,
  initialVariants,
  initialProducts,
} from './seedData.js';

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sreecollections';
    await mongoose.connect(uri);
    console.log('[Seed] Connected to MongoDB for database initialization...');

    // Clear existing collections
    await Category.deleteMany();
    await SubCategory.deleteMany();
    await Brand.deleteMany();
    await VariantAttribute.deleteMany();
    await Product.deleteMany();

    // Insert categories
    const createdCategories = await Category.insertMany(initialCategories);
    console.log(`[Seed] Seeded ${createdCategories.length} categories`);

    // Insert subcategories
    const createdSubCats = await SubCategory.insertMany(initialSubCategories);
    console.log(`[Seed] Seeded ${createdSubCats.length} subcategories`);

    // Insert brands
    const createdBrands = await Brand.insertMany(initialBrands);
    console.log(`[Seed] Seeded ${createdBrands.length} brands`);

    // Insert variants
    const createdVariants = await VariantAttribute.insertMany(initialVariants);
    console.log(`[Seed] Seeded ${createdVariants.length} variant attributes`);

    // Map categories for products
    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.name] = c._id;
    });

    const productsWithCats = initialProducts.map((p) => ({
      ...p,
      category: catMap[p.categoryName] || p.categoryName,
    }));

    const createdProducts = await Product.insertMany(productsWithCats);
    console.log(`[Seed] Seeded ${createdProducts.length} initial products successfully!`);

    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  }
};

seed();
