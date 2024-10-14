const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express(); 

const env = process.env;

mongoose.connect(env.MONGO_URI)
    .then(() => console.log('Database connected'))
    .catch((err) => console.log(`Failed to connect ${err}`));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => { 
    console.log(`Server listening on Port: ${PORT}`);
})