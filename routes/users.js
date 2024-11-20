import { Router } from 'express';
import User from "./../models/Users.js"

const router = Router(); 

router.post('/', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).send({
            registered: false, 
            msg: "User not added - username and password are both required."
        });
    }

    try {
        const registeredUser = new User({
            username,
            password,
            role: role ? role : "Staff"
        });

        const savedUser = await registeredUser.save();

        return res.status(201).send({ 
            registered: true, 
            msg: `User ${savedUser.username} has been added as ${savedUser.role}.` 
        });
    } catch (error) {
        // Handle unique username constraint
        console.error('Error:', error.message);
        if (error.code === 11000) { 
            return res.status(400).send({
                registered: false, 
                msg: `The username ${username} is already in use. Please choose another and try again.`
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

router.get('/:username', async (req, res) => { 
    const usernameSearch = req.params.username;

    try {
        const usernameMatch = await User.findOne({ username: usernameSearch });

        if (!usernameMatch) {
            return res.status(400).send({ 
                success: false, 
                msg: `Username ${usernameSearch} not found. Try creating a new account`
            });
        }
        
        res.status(200).send({ 
            success: true,
            msg: usernameMatch });

    } catch (err) { 
        res.status(500).send({ success: false, msg: err.message });
    };
});

export default router; 