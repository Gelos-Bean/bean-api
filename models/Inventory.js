import mongoose from "mongoose";
const {Schema, model} = mongoose;

//Ignore for now

const inventorySchema = new Schema({
    name: { type: String, required: true },
    perishable: { type: Boolean, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    rangedBy: [{
        supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' }
    }]
},{ timestamps: true });

const Inventory = model('Inventory', inventorySchema);
export default Inventory;