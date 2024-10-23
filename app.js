import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import Router from './routes/routes.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

//env const used for better readibility with dotenv library
const env = process.env;

mongoose.connect(env.MONGO_LOCAL)
    .then(() => console.log('Database connected'))
    .then(() => {
        app.listen(PORT, () => { 
            console.log(`Server listening on Port: ${PORT}`);
        })
    })
    .catch((err) => console.log(`Failed to connect ${err}`));

Router(app);