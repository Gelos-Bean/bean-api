import mongoose from "mongoose";
const {Schema, SchemaTypes, model} = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    //category: { type: String, required: true }, //Eg: Kitchen or Bar, dictates the Order screen to dispay to
    course: { type: String, required: false }, //Eg: Entree, not required for Bar products
    //Let's take out inventory for now
    // inventory: [{
    //     item: { type: Schema.Types.ObjectId, ref: 'Inventory' },
    //     quantityNeeded: { type: Number }
    // }],
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