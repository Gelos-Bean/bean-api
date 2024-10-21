import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import Router from './routes/routes.js';
// import Seeder from './seeder/seeder.js';

/**
 * I wanted to make a new DB using the options schema, but I was having trouble getting products to reference options
 * when being seeded as each time the options would have different IDs. My workaround is to manually first insert seeder/optionsNew.json 
 * on MongoDB Compass, and then manually insert seeder/products.json. It aint pretty but it works.*/

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

//env const used for better readibility with dotenv library
const env = process.env;

mongoose.connect(env.MONGO_URI)
    .then(() => console.log('Database connected'))
    // .then(() => {
    //     Seeder();
    // })
    .then(() => {
        app.listen(PORT, () => { 
            console.log(`Server listening on Port: ${PORT}`);
        })
    })
    .catch((err) => console.log(`Failed to connect ${err}`));

Router(app);