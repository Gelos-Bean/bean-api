import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import Router from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 8080;

//env const used for better readibility with dotenv library
const env = process.env;

mongoose.connect(env.MONGO_URI)
    .then(() => console.log('Database connected'))
    .then(() => {
        app.listen(PORT, () => { 
            console.log(`Server listening on Port: ${PORT}`);
        })
    })
    .catch((err) => console.log(`Failed to connect ${err}`));


app.use(express.json());

Router(app);