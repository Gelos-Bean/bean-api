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
                const addProd = new Product({
                    name: item.name,
                    price: item.price, 
                    course: item.course,
                    options: item.options,
                    image: item.image,
                }, {timestamps: item.timestamps});
                addProd.save();
            }
            console.log('DB Product seeded');
        }
        if (!TableCheck){
            for (const table of tables){
                const addTable = new Table({
                    tableNo: table.tableNo,
                    isOpen: table.isOpen,
                    openedAt: table.openedAt,
                    pax: table.pax,
                    limit: table.limit,
                    comment: table.comment,
                    products: table.products,
                    total: table.total
                });
                addTable.save();
            }
            console.log('DB Table seeded');
        }

        if (!OrderCheck){
            for(const order of orders){
                const addOrder = new Order({
                    table: order.table,
                    products: order.products
                }, { timestamps: order.timestamps })
                addOrder.save(); 
            }
            console.log('DB Order seeded');
        }
    } catch(err) { 
        console.log(`Error in seeding process: ${err}`);
    };    
};