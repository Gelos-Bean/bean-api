import items from './products.json' with { type: "json" };
import Product from '../model/Product.js';

export default async function Seeder(){  
    try { 
        const alreadySeededCheck = await Product.findOne(); 
    
        if(!alreadySeededCheck){
            items.map(item => { 
                const addprod = new Product({
                    name: item.name,
                    price: item.price, 
                    category: item.category,
                    options: [{
                        description: item.description, 
                        price: item.price
                    }],
                    //image: item.image,
                },{timestamps: item.timestamps});
                addprod.save();
            })
            console.log('Database successfully seeded');
        } else {
            console.log('Database already seeded');
        }
    } catch(err) { 
        console.log(`Error in seeding process: ${err}`);
    };    
};