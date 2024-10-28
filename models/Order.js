import mongoose from "mongoose";
const {Schema, SchemaTypes, model} = mongoose;

const orderSchema = new Schema({
    table: {
        type: SchemaTypes.ObjectId, 
        ref: 'Table' },
    products: [{
        item: { type: SchemaTypes.ObjectId, ref: 'Product' , required: true }, 
        selectedOptions: [{ type: SchemaTypes.ObjectId, ref: 'Option' }],
        quantity: { type: Number, default: 1 },
        isSent: { type: Boolean, default: false }
    }],
},{ timestamps: true });

const Order = model('Order', orderSchema);
export default Order;