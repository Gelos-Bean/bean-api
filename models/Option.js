import mongoose from "mongoose";
const { Schema, model } = mongoose;

const optionSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number,
        default: 0, 
        required: true }
},{ timestamps: true });

const Option = model('Option', optionSchema);
export default Option; 