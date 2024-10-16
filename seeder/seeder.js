import items from './products.json' with { type: "json" };
import Product from '../model/Product.js';

export default async function Seeder(){  
    try { 
        const alreadySeededCheck = await Product.findOne(); 
    
        if(!alreadySeededCheck){
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
    } catch(err) { 
        console.log(`Error in seeding process: ${err}`);
    };    
};