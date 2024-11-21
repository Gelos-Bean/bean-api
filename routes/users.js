import { Router } from 'express';
import User from "./../models/Users.js"

const router = Router(); 

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

        return res.status(201).send({ 
            registered: true, 
            msg: `User ${savedUser.name} has been added as ${savedUser.role}.` 
        });
    } catch (error) {
        // Handle unique username constraint
        console.error('Error:', error.message);
        if (error.code === 11000) { 
            return res.status(400).send({
                registered: false, 
                msg: `That username is already in use. Please choose another and try again.`
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
    };
});

router.post('/login', async (req, res) => { 
    const { pin, username } = req.body;

    try {
        const usernameMatch = await User.findOne({ username: username });

        if (!usernameMatch) {
            return res.status(400).send({ 
                success: false, 
                msg: `Username ${username} not found. Try creating a new account`
            });
        }
        const success = await usernameMatch.comparePin(pin);

        if (success) {
            res.status(200).send({ 
                success: true,
                msg: `Credentials for ${username} accepted. Login authorised` });
        } else {
            res.status(403).send({ 
                success: false,
                msg: `Credentials for ${username} not accepted. Login not authorised` });
        }

    } catch (err) { 
        res.status(500).send({ success: false, msg: err.message });
    };
});

export default router; 