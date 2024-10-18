import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Table from '../models/Table.js';



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
                    msg: `${newItem.name} saved`
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
                    msg: 'No products found'
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
    

    app.get('/products/:name', async (req, res) => {

        try { 
            const findProduct = await Product.findByName(req.params.name);

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
            const updateProd = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })

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
        };
    });



    //CRUD ops for Tables
    app.post('/new-table', (req, res) => {
    
        const add = req.body

        const newTable = new Table({
            tableNo: add.tableNo,
            pax: add.pax,
            limit: add.limit
        });

//------> is this handling all possible errors? 
        newTable.save()
            .then(() => {
                res.status(200).send({
                    success: true,
                    msg: `Table ${newTable.tableNo} created`
                });
            })
            .catch(err => { 
                res.status(500).send({
                    success: false,
                    msg: err
                });
            });
    });


    app.get('/tables', async (req, res) => { 

        try {
            const allOrders = await Order.find({});

            if (!allOrders) {
                return res.status(400).send({
                    success: false,
                    msg: 'No orders found'
                });
            }
            
            res.status(200).send({
                success: true, 
                msg: allOrders
            });

        } catch (err) { 
            res.status(500).send({ status: false, msg: err });
        };
    })


    app.get('/orders/:id', async (req, res) => { 

        try { 
            const findOrder = await Order.findById(req.params.id);

            if(!findOrder){
                return res.status(400).send({
                    success: false,
                    msg: 'Order not found'
                });
            }

            res.status(200).send({
                status: true,
                msg: findOrder
            });

        } catch (err) { 
            res.status(500).send({ status: false, msg: err });
        };
    })


    app.put('/orders/:id', async (req, res) => { 

        try { 
            const updateOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })

            if(!updateOrder){
                return res.status(400).send({
                    success: false,
                    msg: 'Order not found'
                });
            }

            res.status(200).send({
                success: true,
                msg: `${updateOrder.name} updated`
        });

        } catch (err) { 
            res.status(500).send({ status: false, msg: err });
        };
    })


    app.delete('/orders/:id', async (req, res) => {

        try { 
            const deleteOrder = await Order.findByIdAndDelete(req.params.id);
            
            const deleteName = deleteOrder.name;

            if(!deleteOrder){
                return res.status(400).send({
                    success: false,
                    msg: 'Order not found'
                });
            }

            res.status(200).send({
                success: true,
                msg: `${deleteName} deleted successfully`
            });

        } catch (err) { 
            res.status(500).send({ status: false, msg: err });
        }
    });






    // CRUD ops for Orders
    app.post('/new-order', (req, res) => {
        
        let add = req.body

        const newOrder = new Order({
            table: add.table,
            products: add.products
        });

//------> is this handling all possible errors? 
        newOrder.save()
            .then(() => {
                res.status(200).send({
                    success: true,
                    msg: `Order ${newOrder._id} saved`
                });
            })
            .catch(err => { 
                res.status(500).send({
                    success: false,
                    msg: err
                });
            });
    });


    app.get('/orders', async (req, res) => { 

        try {
            const allOrders = await Order.find({});

            if (!allOrders) {
                return res.status(400).send({
                    success: false,
                    msg: 'No orders found'
                });
            }
            
            res.status(200).send({
                success: true, 
                msg: allOrders
            });

        } catch (err) { 
            res.status(500).send({ status: false, msg: err });
        };
    })


    app.get('/orders/:id', async (req, res) => { 

        try { 
            const findOrder = await Order.findById(req.params.id);

            if(!findOrder){
                return res.status(400).send({
                    success: false,
                    msg: 'Order not found'
                });
            }

            res.status(200).send({
                status: true,
                msg: findOrder
            });

        } catch (err) { 
            res.status(500).send({ status: false, msg: err });
        };
    })


    app.put('/orders/:id', async (req, res) => { 

        try { 
            const updateOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })

            if(!updateOrder){
                return res.status(400).send({
                    success: false,
                    msg: 'Order not found'
                });
            }

            res.status(200).send({
                success: true,
                msg: `${updateOrder.name} updated`
        });

        } catch (err) { 
            res.status(500).send({ status: false, msg: err });
        };
    })


    app.delete('/orders/:id', async (req, res) => {

        try { 
            const deleteOrder = await Order.findByIdAndDelete(req.params.id);
            
            const deleteName = deleteOrder.name;

            if(!deleteOrder){
                return res.status(400).send({
                    success: false,
                    msg: 'Order not found'
                });
            }

            res.status(200).send({
                success: true,
                msg: `${deleteName} deleted successfully`
            });

        } catch (err) { 
            res.status(500).send({ status: false, msg: err });
        }
    });
};