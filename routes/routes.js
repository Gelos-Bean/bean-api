import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Table from '../models/Table.js';
import Option from '../models/Option.js';


export default function Router(app){ 
    
    // CRUD ops for Products
    app.post('/add-item', (req, res) => {
        
        const add = req.body; 

        const newItem = new Product({
            name: add.name,
            price: add.price,
            course: add.course,
            options: req.body.options.map(op => op._id),
            image: add.image
        });

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
            const allProducts = await Product.find({}).populate('options');

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
            res.status(500).send({ success: false, msg: err });
        };
    });
    

    // Returns all products where the route parameter
    // is found anywhere in the 'name' field of the database, 
    // regardless of its position. Also case insensitive
    app.get('/products/:name', async (req, res) => {
        
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
                msg: findProduct
            });

        } catch (err) { 
            console.log(err);
            res.status(500).send({ success: false, msg: err });
        };
    });


    app.put('/products/:id', async (req, res) => {

        try { 
            const updateProd = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

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
            res.status(500).send({ success: false, msg: err });
        };
    });


    app.delete('/products/:id', async (req, res) => { 

        try { 
            const deleteProd = await Product.findByIdAndDelete(req.params.id);
            
            if(!deleteProd){
                return res.status(400).send({
                    success: false,
                    msg: 'Product not found'
                });
            }

            res.status(200).send({
                success: true,
                msg: `${deleteProd.name} deleted successfully`
            });

        } catch (err) { 
            res.status(500).send({ success: false, msg: err });
        };
    });




    //CRUD ops for Tables
    app.post('/new-table', (req, res) => {
    
        const add = req.body;

        const newTable = new Table({
            tableNo: add.tableNo,
            pax: add.pax,
            limit: add.limit,
            products: add.products,
            total: add.total ? add.total : 0
        });

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
            const allTables = await Table.find({})
            .populate({
                path: 'products.item',
                model: 'Product'})
            .populate({
                path: 'products.selectedOptions',
                model: 'Option'}
            );

            if (!allTables) {
                return res.status(400).send({
                    success: false,
                    msg: 'No tables found'
                });
            }
            
            res.status(200).send({
                success: true, 
                msg: allTables
            });

        } catch (err) { 
            res.status(500).send({ success: false, msg: err });
        };
    })


    app.get('/tables/:tableNo', async (req, res) => { 
        const tableNoURI = req.params.tableNo;
        const URINumCheck = isNaN(parseInt(req.params.tableNo));
    
        if (URINumCheck) {
            return res.status(400).send({
                success: false,
                msg: "Not a number"
            });
        }
    
        try { 
            const findTable = await Table.findOne({ tableNo: tableNoURI })
            .populate({
                path: 'products.item',
                model: 'Product'})
            .populate({
                path: 'products.selectedOptions',
                model: 'Option'}
            );
    
            if (!findTable) {
                return res.status(404).send({
                    success: false,
                    msg: 'Order not found'
                });
            }
    
            res.status(200).send({
                success: true,
                msg: findTable
            });
    
        } catch (err) { 
            res.status(500).send({ success: false, msg: err.message });
        }
    });


    app.put('/tables/:id', async (req, res) => { 

        try { 
            const updateTable = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true })
            
            if(!updateTable){
                return res.status(400).send({
                    success: false,
                    msg: 'Order not found'
                });
            }

            res.status(200).send({
                success: true,
                msg: `Table ${updateTable.tableNo} updated`
        });

        } catch (err) { 
            res.status(500).send({ success: false, msg: err });
        };
    })


    app.delete('/tables/:id', async (req, res) => {

        try { 
            const deleteTable = await Table.findByIdAndDelete(req.params.id);
            
            if(!deleteTable){
                return res.status(400).send({
                    success: false,
                    msg: 'Table not found'
                });
            }

            res.status(200).send({
                success: true,
                msg: `Table ${deleteTable.tableNo} deleted successfully`
            });

        } catch (err) { 
            res.status(500).send({ success: false, msg: err });
        }
    });




    // CRUD ops for Orders

    // pass tableNum & product ID 
    app.post('/new-order', async (req, res) => {

        try  {
            // new order items to be added to order & table
            const orderItems = req.body.products;
            const saveToTab = {...orderItems[0]};
            // save items to table
            const table = await Table.findById(req.body.table._id);
            table.products.push(saveToTab);
            table.save();

            const newOrder = new Order({
                table: table,
                products: orderItems
            });

            const saveOrder = await newOrder.save();

            if (!saveOrder){
                return res.status(400).send({
                    success: false, 
                    msg: `Error sending order`
                });
            };

            res.status(200).send({
                success: true,
                msg: `Order ${newOrder._id} sent`
            });
        
        } catch(err) { 
            console.log(err);
            res.status(500).send({
                success: false,
                msg: err
            });
        };
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
            res.status(500).send({ success: false, msg: err });
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
                success: true,
                msg: findOrder
            });

        } catch (err) { 
            res.status(500).send({ success: false, msg: err });
        };
    })


    app.put('/orders/:id', async (req, res) => { 

        try { 

            // get order items 
            // compare order.products against req.body products
            // find table 
            //      if changes === product changes
            //              update
            //      else leave
            // Update order



            const updateOrder = await Order.findByIdAndUpdate(req.params._id, req.body, { new: true })

           
            const updateTable = await Table.findByIdAndUpdate(req.params.table._id, req.body.products,  { new: true })

            table.products.push(saveToTab);
            table.save();


            res.status(200).send({
                success: true,
                msg: `${updateOrder.name} updated`
        });

        } catch (err) { 
            res.status(500).send({ success: false, msg: err });
        };
    })


    app.delete('/orders/:id', async (req, res) => {

        try { 

// ----> Stretch TO DO: send item to sales history before deleting

            const deleteOrder = await Order.findByIdAndDelete(req.params.id);
            
            if(!deleteOrder){
                return res.status(400).send({
                    success: false,
                    msg: 'Order not found'
                });
            }

            res.status(200).send({
                success: true,
                msg: `${deleteOrder._id} deleted successfully`
            });

        } catch (err) { 
            res.status(500).send({ success: false, msg: err });
        }
    });





     // CRUD ops for Options
     app.post('/add-option', (req, res) => {
        
        const add = req.body; 

        const newOption = new Option({
            name: add.name,
            price: add.price,
        });

        newOption.save()
            .then(() => {
                res.status(200).send({
                    success: true,
                    msg: `${newOption.name} saved`
                });
            })
            .catch(err => { 
                res.status(500).send({
                    success: false,
                    msg: err
                });
            });
    });
    

    app.get('/options', async (req, res) => { 
        try {
            const allOptions = await Option.find({});

            if (!allOptions) {
                return res.status(400).send({
                    success: false,
                    msg: 'No options found'
                });
            }

            res.status(200).send({
                success: true, 
                msg: allOptions
            });

        } catch (err) { 
            res.status(500).send({ success: false, msg: err });
        };
    });
    

    app.get('/options/:name', async (req, res) => {
        
        const optionNameURI = req.params.name.toLowerCase();
        
        try { 
            const findOption = await Option.findOne({
                name: { $regex: new RegExp(optionNameURI, "i") }
              }).populate('options');

            if(!findOption){
                return res.status(400).send({
                    success: false,
                    msg: 'Option not found'
                });
            }

            res.status(200).send({
                success: true,
                msg: findOption
            });

        } catch (err) { 
            console.log(err);
            res.status(500).send({ success: false, msg: err });
        };
    });


    app.put('/options/:id', async (req, res) => {

        try { 
            const updateOption = await Option.findByIdAndUpdate(req.params.id, req.body, { new: true });

            if(!updateOption){
                return res.status(400).send({
                    success: false,
                    msg: 'Option not found'
                });
            }

            res.status(200).send({
                success: true,
                msg: `${updateOption.name} updated`
        });

        } catch (err) { 
            res.status(500).send({ success: false, msg: err });
        };
    });


    app.delete('/options/:id', async (req, res) => { 

        try { 
            const deleteOption = await Option.findByIdAndDelete(req.params.id);
            
            if(!deleteOption){
                return res.status(400).send({
                    success: false,
                    msg: 'Product not found'
                });
            }

            res.status(200).send({
                success: true,
                msg: `${deleteOption.name} deleted successfully`
            });

        } catch (err) { 
            res.status(500).send({ success: false, msg: err });
        };
    });
};