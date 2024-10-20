import mongoose from "mongoose";
const {Schema, SchemaTypes, model} = mongoose;

const orderSchema = new Schema({
    table: {
        type: SchemaTypes.ObjectId, 
        ref: 'Table' },
    products: [{
        item: { 
            type: SchemaTypes.ObjectId, 
            ref: 'Product' }, //I think that this is a zero-many, as the array is extensible but required is set to false
        quantity: { type: Number},
        isSent: { type: Boolean }
    }],
},{ timestamps: true });
/**
 * I think that as soon as a table is assigned then there is application logic for:
 *      1. TableNumber.products.push(this.products)
 *      2. POST this Order, and GET from the kitchen
 *      3. Once the order is marked "Sent" from the kitchen, destroy the object (memory management), as the important data
 *          is now stored in the Table so this object is irrelevant
 * 
 * Need to figure out logic for isSent bool
 */

const Order = model('Order', orderSchema);
export default Order;