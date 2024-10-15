import mongoose from "mongoose";
const {Schema, model} = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, //Eg: Kitchen or Bar, dictates the Order screen to dispay to
    course: { type: String, required: false }, //Eg: Entree, not required for Bar products
    inventory: [{
        item: { type: Schema.Types.ObjectId, ref: 'Inventory' },
        quantityNeeded: { type: Number }
    }],
    options: [{
        description: { type: String },
        price: { type: Number }
        /*
        I think another way this could be done is to have each option be its own Product,
        that way it would have all the properties of a product such as inventory for stock management.
        Might be a little cleaner? 

        Otherwise, there could just be an algorithm for *.price =+ *.options.price.Sum() or something.
        */
    }]
},{ timestamps: true });

const Product = model('Product', productSchema);
export default Product;