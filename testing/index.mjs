/**
 * This is an application to test database capabilities, logic and cohesion.
 * 
 * It does the following:
 * 1. creates a new database
 * 2. creates and adds a product
 * 3. creates an adds a product that uses the first product as an option
 * 4. creates and adds a new table
 * 5. creates and adds an order using the products and table
 * 6. adds the products from the order to the table
 * 
 * Run with node .\index.mjs
 */

import mongoose from 'mongoose';

import 'dotenv/config';
import Product from '../models/Product.js';
import Table from '../models/Table.js';
import Order from '../models/Order.js';

const env = process.env;

// Database connection
const db = mongoose.connect('mongodb://localhost/beanscene')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

async function run() {
  try {
    // Creating a new product
    const gfBun = new Product({
      name: "Gluten Free Bun",
      price: 2,
      category: "Kitchen",
      course: "Main",
    });
    await gfBun.save();
    console.log('Gluten Free Bun saved successfully');

    // Creating a new product that has another product as an option
    const chxBurger = new Product({
      name: "Fried Chicken Burger",
      price: 18,
      category: "Kitchen",
      course: "Main",
      options: [{ item: gfBun._id }],
      image: "../assets/images/chxBurger1.jpg"
    });
    await chxBurger.save();
    console.log('Fried Chicken Burger saved successfully');

    // Creating a table for the first time
    const table01 = new Table({
      tableNo: 1,
      isOpen: false,
      openedAt: Date.now(),
      pax: 0,
      total: 0
    });
    await table01.save();
    console.log('Table 01 saved successfully');

    // Placing a new order
    const order = new Order({
      table: table01._id,
      products: [{
        item: chxBurger._id,
        quantity: 2,
        isSent: false
      }]
    });
    await order.save();
    console.log('New order saved successfully');

    // Adding order to the table and updating the table
    order.products.forEach(product => {
      table01.products.push(product);
    });
    await table01.save();
    console.log('Table updated with new order successfully');

    // Opening a table (Method 01)
    table01.isOpen = true;
    table01.openedAt = Date.now();
    await table01.save();
    console.log('Table opened successfully');

    // Resetting the table (for testing purposes)
    table01.isOpen = false;
    await table01.save();
    console.log('Table closed successfully');

    // Opening a table (Method 02)
    table01.products.length == 0 ? table01.isOpen = false : table01.isOpen = true; 
    table01.openedAt = Date.now();   
    await table01.save();
    console.log('Table status updated based on products');
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
