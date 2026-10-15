import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { initialCategories, initialProducts } from './seedData.js';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sreecollections');
    console.log('Connected to MongoDB for seeding...');
    await Category.deleteMany();
    await Product.deleteMany();

    const createdCategories = await Category.insertMany(initialCategories);
    const catMap = {};
    createdCategories.forEach(c => { catMap[c.slug] = c._id; });

    const productsWithCats = initialProducts.map(p => ({
      ...p,
      slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: catMap[p.categorySlug] || createdCategories[0]._id,
    }));

    await Product.insertMany(productsWithCats);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
