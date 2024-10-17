import Product from '../models/Product.js';

export default function Router(app){ 
    
    // CRUD ops for Menu Items
    app.post('/add-item', (req, res) => {
        const newItem = new Product({
            name: 'Chips',
            price: 8.00,
            course: 'Side'
        });
    
        newItem.save()
            .then(result => {
                res.send(result);
            })
            .catch(err => { 
                res.status(500).send('Product not saved');
            });
    });
    
    app.get('/menu', (req, res) => { 
        Product.find()
            .then(result => { 
                res.send(result);
            })
            .catch(err => {
                res.status(404).send('Menu not found');
            });
    });
    
    app.get('/menu/:id', (req, res) => {
        Product.findById(req.params.id)
            .then(result => { 
                res.send(result);
            })
            .catch(err => { 
                res.status(404).send('Item not found');
            });
    });


    /*app.put('menu/:id', (req, res) => {
        Product.findOneAndUpdate({ id: req.params.id })
            
    })*/


    app.delete('/menu/:id', (req, res) => { 
        Product.findOneAndDelete(req.params.id)
            .then((result) => {
                console.log(result)
                res.status(200).send(`${result.name} deleted successfully`);
            })
            .catch(err => { 
                res.status(404).send('Item not found');
            })
    })


    // CRUD ops for Orders
    app.post('order/:id', (req, res) => {

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