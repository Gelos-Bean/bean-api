import mongoose from "mongoose";
const {Schema, model} = mongoose;

const tableSchema = new Schema({
    tableNo: { type: Number, required: true,  unique: true},
    openedAt: { 
        type: Date, 
        default: Date.now
      },
    pax: {type: Number, required: true},
    name: { type: String, required: false },
    limit: { type: Number, required: false },
    comment: { type: String, required: false },
    products: [{
        item: { type: Schema.Types.ObjectId, ref: 'Product' }, 
        quantity: { type: Number}
    }],
    total: { type: Number, required: true },
});

const Table = model('Table', tableSchema);
export default Table;