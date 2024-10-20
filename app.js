import express from 'express';
API-building
import mongoose from 'mongoose';
import 'dotenv/config';
import Router from './routes/routes.js';
//import Seeder from './seeder/seeder.js';

import mongoose from'mongoose';

import 'dotenv/config'; 
const env = process.env;
main

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

//env const used for better readibility with dotenv library
const env = process.env;

mongoose.connect(env.MONGO_URI)
    .then(() => console.log('Database connected'))
    /*.then(() => {
        Seeder();
    })*/
    .then(() => {
        app.listen(PORT, () => { 
            console.log(`Server listening on Port: ${PORT}`);
        })
    })
    .catch((err) => console.log(`Failed to connect ${err}`));

Router(app);