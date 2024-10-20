import mongoose from "mongoose";
const {Schema, SchemaTypes, model} = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    course: { type: String, required: true },
    options: [{
                type: SchemaTypes.ObjectId, 
                ref: 'Product'
        }],
    image: { type: String, required: false }
},{ timestamps: true });

const Product = model('Product', productSchema);
export default Product;