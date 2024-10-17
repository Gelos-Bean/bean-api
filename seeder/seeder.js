import items from './products.json' assert { type: "json" };
import tables  from './tables.json' assert { type: "json" };
import orders from './orders.json' assert { type: "json" };

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
            console.log('DB Product successfully seeded');
        }
        if(!TableCheck){
            for (const table of tables){
                const addTable = new Table({
                    tableNo: table.tableNo, 
                    isOpen: table.isOpen, 
                    openedAt: table.openedAt,
                    pax: table.pax, 
                    name: table.name, 
                    limit: table.limit, 
                    comment: table.comment, 
                    products: table.products, 
                    total: table.products
                });
                addTable.save();
            }
            console.log('DB Table successfully seeded');
        }
        if (!OrderCheck){
            for (const order of orders){
                const addOrder = new Order({
                    table: order.table, 
                    products: order.products,
                }, {timestamps: order.timestamps});
                addOrder.save();
            }
            console.log('DB Order successfully seeded');
        }
    } catch(err) { 
        console.log(`Error in seeding process: ${err}`);
    };    
}; 