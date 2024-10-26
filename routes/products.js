import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

router.post('/add-product', async (req, res) => {
    try { 
        const add = req.body; 

        const newItem = new Product({
            name: add.name,
            price: add.price,
            course: add.course,
            options: add.options,
            image: add.image
        });

        await newItem.save();

        res.status(200).send({ 
            success: true, 
            msg: `${newItem.name} saved` });

    } catch (err) { 

        if (err.name === "ValidationError"){
            return res.status(400).send({ 
                success: false, 
                msg: err.message 
            });
        }
        res.status(500).send({ success: false, msg: err.message });
    }
});


router.get('/', async (req, res) => { 
    try {
        const allProducts = await Product.find({}).populate('options');

        if (!allProducts) {
            return res.status(400).send({ 
                success: false, 
                msg: 'No products found' 
            });
        }

        res.status(200).send({ 
            success: true,  
            msg: allProducts });

    } catch (err) { 
        res.status(500).send({ success: false, msg: err.message });
    };
});


// Returns all products where the route parameter
// is found anywhere in the 'name' field of the database, 
// regardless of its position. Also case insensitive
router.get('/:name', async (req, res) => {
    
    const prodNameURI = req.params.name.toLowerCase();
    
    try { 
        const findProduct = await Product.findOne({
            name: { $regex: new RegExp(prodNameURI, "i") }
        }).populate('options');

        if(!findProduct){
            return res.status(400).send({ 
                success: false, 
                msg: 'Product not found' 
            });
        }

        res.status(200).send({ 
            success: true, 
            msg: findProduct });

    } catch (err) { 
        res.status(500).send({ success: false, msg: err.message });
    };
});


router.put('/:id', async (req, res) => {

    try { 
        const updateProd = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );

        res.status(200).send({ 
            success: true, 
            msg: `${updateProd.name} updated` 
        });

    } catch (err) { 
        
        if(err.name === "CastError"){
            return res.status(400).send({ 
                success: false, 
                msg: 'Product not found' 
            });
        }
        res.status(500).send({ success: false, msg: err.message });
    };
});


router.delete('/:id', async (req, res) => { 

    try { 
        const deleteProd = await Product.findByIdAndDelete(req.params.id);

        res.status(200).send({ 
            success: true,
            msg: `${deleteProd.name} deleted successfully`
        });

    } catch (err) {

        if(err.name === "CastError"){
            return res.status(400).send({ 
                success: false, 
                msg: 'Product not found' });
        }

        res.status(500).send({ success: false, msg: err.message });
    };
});

export default router; 