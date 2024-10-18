import mongoose from "mongoose";
const {Schema, SchemaTypes, model} = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    options: [{
            item: { 
                type: SchemaTypes.ObjectId, 
                ref: 'Product' },
            quantity: { type: Number }
        }],
    image: { type: String, required: false }
},{ timestamps: true });

const Product = model('Product', productSchema);
export default Product;