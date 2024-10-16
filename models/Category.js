import mongoose from "mongoose";
const {Schema, model} = mongoose;

//This is stupid we don't need this

const categorySchema = new Schema({
    name: { type: String, required:true }
});

const Category = model('Category', categorySchema);
export default Category;