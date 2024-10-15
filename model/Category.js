import mongoose from "mongoose";
const {Schema, model} = mongoose;

const categorySchema = new Schema({
    name: { type: String, required:true }
});

//This is stupid we don't need this

const Category = model('Category', categorySchema);
export default Category;