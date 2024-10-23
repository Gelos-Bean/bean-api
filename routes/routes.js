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
            const allProducts = await Product.find({}).populate({
                path: 'options.item',
                model: 'Option'
          });

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
        
        const prodNameURI = req.params.name;
        
        try { 
            const findProduct = await Product.find({
                name: { $regex: new RegExp(prodNameURI, "i") }
              }).populate({
                    path: 'options.item',
                    model: 'Option'
              });

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
            const updateProd = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate({
                path: 'options.item',
                model: 'Option'
          });

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
            total: add.total ? add.total : 0
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
            const allTables = await Table.find({});

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
            const findTable = await Table.find({
                    tableNo : tableNoURI
                });

            if(!findTable){
                return res.status(400).send({
                    success: false,
                    msg: 'Order not found'
                });
            }

            res.status(200).send({
                success: true,
                msg: findTable
            });

        } catch (err) { 
            res.status(500).send({ success: false, msg: err });
        };
    })


    // for handling table updates only (Limit, PAX, tableNo, etc.
    // See put /new-order endpoint for adding more products to table
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
            // Add products to running table bill 
            const orderRequest = req.body;

            // new order items to be added to order & table
            const orderItems = req.body.products;

// ---> Does this need error handling if it was already handled in the inital call?
//          maybe server connection errors? (which would be called anyway if it failed?)
            // save to items to table
            const getTable = await Table.findById(orderRequest.table._id);

// ---> Check how product object is being sent through the payload
//      May be unnecessary to find item again             
            for (const item of orderItems) {
                await Product.findById(item._id);
                getTable.products.push(item);
                await getTable.save();
            }

            const newOrder = new Order({
                table: getTable,
                products: orderItems.products
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


// ----> TO DO:  Need to figure out how this actually works
// ---->         look into setting the order _id as Number instead of Object.id?
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
            res.status(500).send({ success: false, msg: err });
        };
    })


    app.delete('/orders/:id', async (req, res) => {

        try { 

// ----> TO DO: send item to sales history before deleting

            const deleteOrder = await Order.findByIdAndDelete(req.params.id);
            
            if(!deleteOrder){
                return res.status(400).send({
                    success: false,
                    msg: 'Order not found'
                });
            }

            res.status(200).send({
                success: true,
                msg: `${deleteOrder.name} deleted successfully`
            });

        } catch (err) { 
            res.status(500).send({ success: false, msg: err });
        }
    });
};