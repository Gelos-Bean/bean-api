import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Table from '../models/Table.js';



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
    

    // Returns all products where the route parameter
    // is found anywhere in the 'name' field of the database, 
    // regardless of its position. Also case insensitive
    app.get('/products/:name', async (req, res) => {
        
        const prodNameURI = req.params.name;
        
        try { 
            const findProduct = await Product.find({
                name: { $regex: new RegExp(prodNameURI, "i") }
              });

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
            console.log(err);
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
            res.status(500).send({ status: false, msg: err });
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
            res.status(500).send({ status: false, msg: err });
        };
    })


    app.get('/tables/:tableNo', async (req, res) => { 

        const tableNoURI = req.params.tableNo;
        const URINumCheck = isNaN(parseInt(req.params.tableNo));

        if (URINumCheck) {
            return res.status(400).send({
                status: false,
                msg: "Not a number"
            })
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
                status: true,
                msg: findTable
            });

        } catch (err) { 
            res.status(500).send({ status: false, msg: err });
        };
    })


    // for handling table updates only (Limit, PAX, tableNo, etc.
    // See put order/:id endpoint for adding more products to table
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
            res.status(500).send({ status: false, msg: err });
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
            res.status(500).send({ status: false, msg: err });
        }
    });
}