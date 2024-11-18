import mongoose from "mongoose";
const {Schema, SchemaTypes, model} = mongoose;

const salesHistorySchema = new Schema({
    date: { type: Date, default: Date.now, required: true },
    sales: [{
        tableNo: { type: Number },
        openedAt: { 
            type: Date, 
            default: Date.now 
          },
        pax: {type: Number },
        limit: { type: Number },
        products: [{
            item: { type: SchemaTypes.ObjectId, ref: 'Product' }, 
            selectedOptions: [{ type: SchemaTypes.ObjectId, ref: 'Option' }],
            quantity: { type: Number}
        }],
        total: { type: Number },
    }],
    totalFood: { type: Number },
    totalBev: { type: Number },
    total: { type: Number },
});

const SalesHistory = model('SalesHistory', salesHistorySchema);
export default SalesHistory;
