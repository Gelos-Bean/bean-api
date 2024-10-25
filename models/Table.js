import mongoose from "mongoose";
const {Schema, SchemaTypes, model} = mongoose;

const tableSchema = new Schema({
    tableNo: { type: Number, required: true,  unique: true}, //Must also handle unique field validation in application logic
    openedAt: { 
        type: Date, 
        default: Date.now
      },
    pax: {type: Number, required: true},
    limit: { type: Number, required: false },
    products: [{
        item: { type: SchemaTypes.ObjectId, ref: 'Product' },
        selectedOptions: [{ type: SchemaTypes.ObjectId, ref: 'Option' }],
        quantity: { type: Number}
    }],
    total: { type: Number, required: true },
});

const Table = model('Table', tableSchema);
export default Table;