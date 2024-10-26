import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Table from '../models/Table.js';
import Option from '../models/Option.js';


export default function Router(app){ 
    
    // CRUD ops for Products
    app.post('/add-item', async (req, res) => {
        
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
                msg: `${newItem.name} saved`
            });

        } catch (err) { 
            if (err.name === "ValidationError"){
                return res.status(400).send({
                    success: false,
                    msg: err.message
                });
            }
            res.status(500).send({
                success: false,
                msg: err.message
            });
        }
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
            res.status(500).send({ success: false, msg: err.message });
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
            res.status(500).send({ success: false, msg: err.message });
        };
    });


    app.put('/products/:id', async (req, res) => {

        try { 
            const updateProd = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

            res.status(200).send({
                success: true,
                msg: `${updateProd.name} updated`
        });

        } catch (err) { 
            console.log(err.name)
            if(err.name === "CastError"){
                return res.status(400).send({
                    success: false,
                    msg: 'Product not found'
                });
            }
            res.status(500).send({ success: false, msg: err.message });
        };
    });


    app.delete('/products/:id', async (req, res) => { 

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
                    msg: 'Product not found'
                });
            }
            res.status(500).send({ success: false, msg: err.message });
        };
    });




    //CRUD ops for Tables
    app.post('/add-table', (req, res) => {
    
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
                if (err.name === "ValidationError"){
                    return res.status(400).send({
                        success: false,
                        msg: err.message
                    });
                }

                res.status(500).send({
                    success: false,
                    msg: err.message
                })
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
            res.status(500).send({ success: false, msg: err.message });
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

            res.status(200).send({
                success: true,
                msg: `Table ${updateTable.tableNo} updated`
        });

        } catch (err) { 
            if(err.name === "CastError"){
                return res.status(400).send({
                    success: false,
                    msg: 'Table not found'
                });
            }
            res.status(500).send({ success: false, msg: err.message });
        };
    })


    app.delete('/tables/:id', async (req, res) => {

        try { 
            const deleteTable = await Table.findByIdAndDelete(req.params.id);

            res.status(200).send({
                success: true,
                msg: `Table ${deleteTable.tableNo} deleted successfully`
            });

        } catch (err) { 
            if(err.name === "CastError"){
                return res.status(400).send({
                    success: false,
                    msg: 'Table not found'
                });
            }

            res.status(500).send({ success: false, msg: err.message });
        }
    });




    // CRUD ops for Orders

    // pass tableNum & product ID 
    app.post('/add-order', async (req, res) => {

        try  {
            // new order items to be added to order & table
            const orderItems = req.body.products;
            const saveToTab = {...orderItems[0]};

            const table = await Table.findById(req.body.table._id);
            
            const newOrder = new Order({
                table: table,
                products: orderItems
            });

            await newOrder.save();

            // save items to table only if order is sent
            table.products.push(saveToTab);
            table.save();


            res.status(200).send({
                success: true,
                msg: `Order ${newOrder._id} sent`
            });
        

        } catch(err) { 
            if (err.name === "ValidationError"){
                return res.status(400).send({
                    success: false,
                    msg: err.message
                });
            }
            res.status(500).send({
                success: false,
                msg: err.message
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
            res.status(500).send({ success: false, msg: err.message });
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
            res.status(500).send({ success: false, msg: err.message });
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
            if(err.name === "CastError"){
                return res.status(400).send({
                    success: false,
                    msg: 'Order not found'
                });
            }
            res.status(500).send({ success: false, msg: err.message });
        };
    })


    app.delete('/orders/:id', async (req, res) => {

        try { 

// ----> Stretch TO DO: send item to sales history before deleting

            const deleteOrder = await Order.findByIdAndDelete(req.params.id);

            res.status(200).send({
                success: true,
                msg: `${deleteOrder._id} deleted successfully`
            });

        } catch (err) { 
            if(err.name === "CastError"){
                return res.status(400).send({
                    success: false,
                    msg: 'Order not found'
                });
            }

            res.status(500).send({ success: false, msg: err.message });
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
                if (err.name === "ValidationError"){
                    return res.status(400).send({
                        success: false,
                        msg: err.message
                    });
                }
                res.status(500).send({
                    success: false,
                    msg: err.message
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
            res.status(500).send({ success: false, msg: err.message });
        };
    });
    

    app.get('/options/:name', async (req, res) => {
        
        const optionNameURI = req.params.name.toLowerCase();
        
        try { 
            const findOption = await Option.findOne({
                name: { $regex: new RegExp(optionNameURI, "i") }
              });

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
            res.status(500).send({ success: false, msg: err.message });
        };
    });


    app.put('/options/:id', async (req, res) => {

        try { 
            const updateOption = await Option.findByIdAndUpdate(req.params.id, req.body, { new: true });

            res.status(200).send({
                success: true,
                msg: `${updateOption.name} updated`
        });

        } catch (err) { 
            if(err.name === "CastError"){
                return res.status(400).send({
                    success: false,
                    msg: 'Option not found'
                });
            }
            res.status(500).send({ success: false, msg: err.message });
        };
    });


    app.delete('/options/:id', async (req, res) => { 

        try { 
            const deleteOption = await Option.findByIdAndDelete(req.params.id);

            res.status(200).send({
                success: true,
                msg: `${deleteOption.name} deleted successfully`
            });

        } catch (err) { 

            if(err.name === "CastError"){
                return res.status(400).send({
                    success: false,
                    msg: 'Option not found'
                });
            }

            res.status(500).send({ success: false, msg: err.message });
        };
    });
};