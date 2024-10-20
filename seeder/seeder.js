/*import items from './products.json' with { type: "json" };
import tables  from './tables.json' with { type: "json" };
import options from './options.json' with { type: "json" };
*/
import Product from '../models/Product.js';
import Table from '../models/Table.js';
import Order from '../models/Order.js';
import Option from '../models/Option.js';


export default async function Seeder(){  
    try { 
        const ProductCheck = await Product.findOne(); 
        const TableCheck = await Table.findOne();
        const OptionCheck = await Option.findOne(); 

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

        if (!OptionCheck){
            for(const option of options){
                const addOption = new Option({
                    name: option.name,
                    price: option.price
                }, { timestamps: option.timestamps })
                addOption.save(); 
            }
            console.log('DB Options seeded');
        }
    } catch(err) { 
        console.log(`Error in seeding process: ${err}`);
    };    
};