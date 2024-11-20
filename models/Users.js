import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import bcrypt from 'bcrypt';
import { roles } from '../config/user-roles.json';


const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String,
        enum: roles.split(','),
        default: roles[0],
        required: true }
}, { timestamps: true });

UserSchema.index({ username: 1 });

UserSchema.pre('save', async function(next) { 
    try { 
        // only hash password if new or modified
        if(!this.isModified('password')) 
            return next();

        const salt = bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.comparePassword = async function(inputPassword) {
    try { 
        return await bcrypt.compare(inputPassword, this.password);
    } catch (err) {
        throw new Error ('Error comparing passwords');
    }
}

const User = model('User', UserSchema);
export default User; 