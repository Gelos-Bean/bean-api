import express from 'express';
import mongoose from 'mongoose';

import 'dotenv/config';
const env = process.env;

const app = express();
const PORT = process.env.PORT || 8080;

import Product from './model/Product.js';

mongoose.connect(env.MONGO_URI)
    .then(() => console.log('Database connected'))
    .then(() => {
        app.listen(PORT, () => { 
            console.log(`Server listening on Port: ${PORT}`);
        })
    })
    .catch((err) => console.log(`Failed to connect ${err}`));

app.post('/newItem', (req, res) => {
    const menuItem = new Product({
        name: "Chicken Salad",
        price: 20.50,
        course: "Main"
    });
    Product.save()
        .then(result => {
            res.send(result)
        })
        .catch(err => { 
            console.log(err);
            res.sendStatus(500);
        });
})

app.get('/menu', (req, res) => { 

})

//Router(app, /*pass db instance*/);