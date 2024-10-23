import mongoose from 'mongoose';
import 'dotenv/config';

import products from './products.json' with { type: "json" };
import tables  from './tables.json' with { type: "json" };
import options from './options.json' with { type: "json" };

import Product from '../models/Product.js';
import Table from '../models/Table.js';
import Option from '../models/Option.js';

const env = process.env;

async function connect() {
    try { 
        const db = await mongoose.connect(env.MONGO_URI);

        if (!db) {
            return console.log('Error connecting to database');
        }
        console.log('Database connected');


        const seed = await Seeder();
        console.log('Data successfully seeded');

    } catch (err) {
        console.log('Error connecting/seeding database' + err);

    } finally {
        await mongoose.disconnect(); 
        console.log('Database disconnected');
    }
}



async function Seeder(){  
    try { 

        // reset database prior to seeding
        // comment out if you do not want to delete data
        await Product.deleteMany();
        await Option.deleteMany();
        await Table.deleteMany();

        const optionData = await Option.insertMany(options);
    
        // take option ids and link the name to the product 
        // items in the dummy data, then seed products db
        const optionLookup = {};
        optionData.forEach(option => {
            optionLookup[option.name] = option._id; 
        });

        const addOptionId = products.map(product => ({
            ...product,
            options: product.options.map(o => optionLookup[o])
        }));

        await Product.insertMany(addOptionId);



        // randomly assign products and quantities to table data
        const seededProducts = await Product.find();
        const productIds = seededProducts.map(product => product._id);
        
        const randomizeProductsForTable = () => {
            const numberOfProducts = Math.floor(Math.random() * 5) + 1;
            const selectedProducts = [];
            
            for (let i = 0; i < numberOfProducts; i++) {
                const randomProduct = productIds[Math.floor(Math.random() * productIds.length)];
                const randomQuantity = Math.floor(Math.random() * 5) + 1;
                
                selectedProducts.push({
                    item: randomProduct,
                    quantity: randomQuantity
                });
            }

            return selectedProducts;
        };

        const tablesWithProducts = tables.map(table => {
            const products = randomizeProductsForTable();

            return { ...table, products };
        });

        await Table.insertMany(tablesWithProducts);

    } catch(err) { 
        console.log(`Error in seeding process: ${err}`);
    };    
};

connect();