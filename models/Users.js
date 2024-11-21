import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import bcrypt from 'bcrypt';
import rolesConfig from '../config/user-roles.json' assert { type: 'json' }; 

const roles = rolesConfig.roles;

const UserSchema = new Schema({
    pin: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: false },
    role: { 
        type: String,
        enum: roles,
        default: roles[0],
        required: true }
}, { timestamps: true });

UserSchema.pre('save', async function(next) { 
    try { 
        // only hash pin if new or modified
        if(!this.isModified('pin')) 
            return next();

        const salt = await bcrypt.genSalt(10);
        this.pin = await bcrypt.hash(this.pin, salt);
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.comparePin = async function(inputPin) {
    try { 
        return await bcrypt.compare(inputPin.toString(), this.pin.toString());
    } catch (err) {
        throw new Error (err);
    }
}

const User = model('User', UserSchema);
export default User; 