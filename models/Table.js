import mongoose from "mongoose";
const {Schema, model} = mongoose;

const tableSchema = new Schema({
    tableNo: { type: Number, required: true,  unique: true }, //Must also handle unique field validation in routes or frontend
    openedAt: { 
        type: Date, 
        default: Date.now 
      },
    pax: {type: Number, required: true},
    limit: { type: Number },
    products: [{
        item: { type: Schema.Types.ObjectId, ref: 'Product' }, 
        selectedOptions: [{ type: SchemaTypes.ObjectId, ref: 'Option' }],
        quantity: { type: Number}
    }],
    total: { type: Number, required: true },
});

const Table = model('Table', tableSchema);
export default Table;