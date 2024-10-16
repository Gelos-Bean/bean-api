import mongoose from "mongoose";
const {Schema, model} = mongoose;

//Ignore for now

const supplierSchema = new Schema({
    name: { type: String, required:true },
    email: { type: String, required:true },
    phone: { type: String, required:true },
    range:[{
        item: { type: Schema.Types.ObjectId, ref: 'Inventory' },
        listPrice: { type: Number }
    }],
});


const Supplier = model('Supplier', supplierSchema);
export default Supplier;