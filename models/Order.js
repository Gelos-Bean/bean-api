import mongoose from "mongoose";
const {Schema, SchemaTypes, model} = mongoose;

const orderSchema = new Schema({
    table: {
        type: SchemaTypes.ObjectId, 
        ref: 'Table' ,
        required: true },
    products: [{
        item: { 
            type: SchemaTypes.ObjectId, 
            ref: 'Product' ,
            required: true },
        quantity: { type: Number},
        isSent: { type: Boolean }
    }],
},{ timestamps: true });


const Order = model('Order', orderSchema);
export default Order;