import mongoose from "mongoose";
const {Schema, SchemaTypes, model} = mongoose;

const orderSchema = new Schema({
    table: {
        type: SchemaTypes.ObjectId, 
        ref: 'Table' },
    products: [{
        item: { 
            type: SchemaTypes.ObjectId, 
            ref: 'Product' }, 
        quantity: { type: Number},
        isSent: { type: Boolean }
    }],
},{ timestamps: true });

const Order = model('Order', orderSchema);
export default Order;