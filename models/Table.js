import mongoose from "mongoose";
const {Schema, model} = mongoose;

const tableSchema = new Schema({
    tableNo: { type: Number, required: true,  unique: true}, //Must ALSO handle unique field validation in application logic
    openedAt: { 
        type: Date, 
        default: Date.now //Requires application logic as well?
      },
    pax: {type: Number, required: true},
    limit: { type: Number, required: false },
    products: [{
        item: { type: Schema.Types.ObjectId, ref: 'Product' }, //I think that this is a zero-many, as the array is extensible by nature and required is set to false
        quantity: { type: Number}
    }],
    total: { type: Number, required: true },
});

const Table = model('Table', tableSchema);
export default Table;