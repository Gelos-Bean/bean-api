import items from './products.json' with { type: "json" };
import tables  from './tables.json' with { type: "json" };
import orders from './orders.json' with { type: "json" };

import Product from '../models/Product.js';
import Table from '../models/Table.js';
import Order from '../models/Order.js';


export default async function Seeder(){  
    try { 
        const ProductCheck = await Product.findOne(); 
        const TableCheck = await Table.findOne();
        const OrderCheck = await Order.findOne(); 

        if(!ProductCheck){
            for (const item of items){
                const addprod = new Product({
                    name: item.name,
                    price: item.price, 
                    course: item.course,
                    options: item.options,
                    image: item.image,
                }, {timestamps: item.timestamps});
                addprod.save();
            }
            console.log('Database successfully seeded');
        }
        if (!OrderCheck){
            for (const order of orders){
                const addOrder = new Order({

                })
            }
        }
    } catch(err) { 
        console.log(`Error in seeding process: ${err}`);
    };    
};