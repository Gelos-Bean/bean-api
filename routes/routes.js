import Product from '../models/Product.js';

export default function Router(app){ 
    
    // CRUD ops for Products
    app.post('/add-item', (req, res) => {
        
        const newItem = new Product({
            name: add.name,
            price: add.price,
            course: add.course,
            options: add.options, 
            image: add.image
        });

//------> is this handling all possible errors? 
        newItem.save()
            .then(() => {
                res.status(200).send({
                    success: true,
                    msg: `${newItem} saved`
                });
            })
            .catch(err => { 
                res.status(500).send({
                    success: false,
                    msg: err
                });
            });
    });
    

    app.get('/products', async (req, res) => { 

        try {
            const allProducts = await Product.find({});

            if (!allProducts) {
                return res.status(400).send({
                    success: false,
                    msg: 'Product not found'
                });
            }
            
            res.status(200).send({
                success: true, 
                msg: allProducts
            });

        } catch (err) { 
            res.status(500).send({ status: false, msg: err });
        };
    });
    

    app.get('/products/:id', async (req, res) => {

        try { 
            const findProduct = await Product.findById(req.params.id);

            if(!findProduct){
                return res.status(400).send({
                    success: false,
                    msg: 'Product not found'
                });
            }

            res.status(200).send({
                status: true,
                msg: findProduct
            });

        } catch (err) { 
            res.status(500).send({ status: false, msg: err });
        };
    });


    app.put('/products/:id', async (req, res) => {

        try { 
            const updateProd = await Product.findByIdAndUpdate(req.params.id, body, { new: true })

            if(!updateProd){
                return res.status(400).send({
                    success: false,
                    msg: 'Product not found'
                });
            }

            res.status(200).send({
                success: true,
                msg: `${updateProd.name} updated`
        });

        } catch (err) { 
            res.status(500).send({ status: false, msg: err });
        };
    });


    app.delete('/products/:id', async (req, res) => { 

        try { 
            const deleteProd = await Product.findByIdAndDelete(req.params.id);
            
            const deleteName = deleteProd.name;

            if(!deleteProd){
                return res.status(400).send({
                    success: false,
                    msg: 'Product not found'
                });
            }

            res.status(200).send({
                success: true,
                msg: `${deleteName} deleted successfully`
            });

        } catch (err) { 
            res.status(500).send({ status: false, msg: err });
        }
    })


    // CRUD ops for Orders
    app.post('/new-order', (req, res) => {

    })

    app.get('/order', (req, res) => { 

    })

    app.get('/order/:id', (req, res) => { 

    })

    app.put('/order/:id', (req, res) => { 

    })

    app.delete('/order/:id', (req, res) => {

    })

}