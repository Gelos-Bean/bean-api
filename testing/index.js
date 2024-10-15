import mongoose from "mongoose";

require('dotenv').config(); 
const env = process.env;

import Supplier from "./model/Supplier";
import Category from "./model/Category";
import Inventory from "./model/Inventory";
import Order from "./model/Order";
import Product from "./model/Product";
import Table from "./model/Table";


mongoose.connect(env.MONGO_URI);

const marcosChicken = new Supplier({
    name: 'Marcos Chicken Emporium',
    email: 'marco@chickenemporium.com',
    phone: '0412345678'
});



