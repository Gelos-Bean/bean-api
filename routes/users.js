import { Router } from 'express';
import User from "./../models/Users.js";
import jsonwebtoken from 'jsonwebtoken';

import 'dotenv/config';
const jwtSecret = process.env.JWT_SECRET;

const router = Router(); 
const jwt = jsonwebtoken;

router.post('/', async (req, res) => {
    const { pin, username, name, role, image } = req.body;

    if (!pin || !username || !name) {
        return res.status(400).send({
            registered: false, 
            msg: "User not added. Pin, username and name are required"
        });
    }

    try {
        const registeredUser = new User({
            pin,
            username,
            name,
            role: role ? role : "Staff",
            image: image ? image : ""
        });

        const savedUser = await registeredUser.save();

        return res.status(200).send({ 
            success: true, 
            msg: `User ${savedUser.username} has been added as ${savedUser.role}.` 
        });
        
    } catch (error) {
        // Handle unique username constraint
        if (error.code === 11000) { 
            return res.status(400).send({
                registered: false, 
                msg: `Username already in use. Please choose another and try again.`
            });
        }
        return res.status(500).send({
            registered: false, 
            msg: "An unexpected error occured. User not added."
        });
    }
});

router.get('/', async (req, res) => { 
    try {
        const allUsers = await User.find({});

        if (!allUsers) {
            return res.status(400).send({ 
                success: false, 
                msg: 'No users found' 
            });
        }
        
        res.status(200).send({ 
            success: true,
            msg: allUsers });

    } catch (err) { 
        res.status(500).send({ success: false, msg: err.message });
        if (error.code === 11000) { 
            return res.status(400).send({
                registered: false, 
                msg: `Username already in use. Please choose another and try again.`
            });
        }
    };
    
});

router.put('/:id', async (req, res) => {
    try {
        const { pin, username, name, role, image } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({
                success: false,
                msg: 'User not found'
            });
        }

        user.username = username || user.username;
        user.name = name || user.name;
        user.pin = pin || user.pin;
        user.role = role || user.role;
        user.image = image || user.image;

        const updatedUser = await user.save();

        res.status(200).send({
            success: true,
            msg: `User ${updatedUser.username} updated`
        });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).send({
                success: false,
                msg: 'Invalid user ID'
            });
        }
        res.status(500).send({ success: false, msg: err.message });
    }
});


router.post('/login', async (req, res) => { 
    const { pin, username } = req.body;

    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(400).send({ 
                success: false, 
                msg: `Username ${username} not found. Try creating a new account`
            });
        }
        const success = await user.comparePin(pin);

        if (success) {
            const token = jwt.sign(
                { 
                    role: user.role, 
                    name: user.name,
                    image: user.image,
                },
                    jwtSecret, {
                    expiresIn: '10m'
                }
                
            )
            res.status(200).send({ 
                success: true,
                msg: `Credentials for ${username} accepted. Login authorised`, 
                token: token});
        } else {
            res.status(403).send({ 
                success: false,
                msg: `Credentials for ${username} not accepted. Login not authorised` });
        }

    } catch (err) { 
        res.status(500).send({ success: false, msg: err.message });
    };
});

router.delete('/:id', async (req, res) => { 

    try { 
        const deleteUser = await User.findByIdAndDelete(req.params.id);

        res.status(200).send({ 
            success: true,
            msg: `${deleteUser.username} deleted successfully`
        });

    } catch (err) {

        if(err.name === "CastError"){
            return res.status(400).send({ 
                success: false, 
                msg: 'User not found' });
        }

        res.status(500).send({ success: false, msg: err.message });
    }
})

export default router; 