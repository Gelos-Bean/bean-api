import mongoose from "mongoose";
const {Schema, model} = mongoose;

import Product from "./Product"; //I don't reckon this is required but leaving it in this file only for reference

const tableSchema = new Schema({
    tableNo: { type: Number, required: true,  unique: true}, //Must ALSO handle unique field validation in application logic
    isOpen: { type: Boolean, required: true }, //I question if this is required in the DB - can be calculated client-side?
    openedAt: { 
        type: Date, 
        default: Date.now //Requires application logic as well?
      },
    pax: {type: Number, required: true},
    name: { type: String, required: false },
    limit: { type: Number, required: false },
    comment: { type: String, required: false },
    products: [{
        item: { type: Schema.Types.ObjectId, ref: 'Product' }, //I think that this is a zero-many, as the array is extensible by nature and required is set to false
        quantity: { type: Number}
    }],
    total: { type: Number, required: true },
});

/*  1. I think we'll need logic in the API endpoints to recalulate the *.total every time an order is added to a table, 
    a product is deleted from a table, and a payment is made for a table.
    
    2. Perhaps also logic for the *.products.Count != 0 ? isOpen = true : isOpen = false

    3. Reset logic required for if *.total == 0: isOpen = false, openedAt = null, pax = 0, limit = null, comment = null, products = null
*/

const Table = model('Table', tableSchema);
export default Table;