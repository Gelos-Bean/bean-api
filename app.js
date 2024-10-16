import express from 'express';
import mongoose from'mongoose';

import 'dotenv/config'; 
const env = process.env;

const app = express();

const PORT = process.env.PORT || 8080;

mongoose.connect(env.MONGO_URI)
    .then(() => console.log('Database connected'))
    .then(() => {
        app.listen(PORT, () => { 
            console.log(`Server listening on Port: ${PORT}`);
        })
    })
    .catch((err) => console.log(`Failed to connect ${err}`));