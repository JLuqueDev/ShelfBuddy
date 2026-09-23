const User = require('./../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// creat new user 
const register = async(req, res) => {
    try {
        const { username, email, password } = req.body;

        let existingUser = await User.findOne({ $or: [{email}, { username }] });
        
        if (existingUser) {
            const input = existingUser.email === email ? 'Email' : 'Username';
            res.status(400).json({ msg: `${input} already exists in the DB!`});
            console.log(`${input} is already registered!`);  // for DEV purposes
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({msg: 'User created successfully!'});
        console.log(`Hi ${user.username}! Welcome to ShelfBuddy!`); // for DEV purposes
        return;

    } catch (err) {
        if (err.code === 11000) {
            console.log('Email or username already exists.');
            return res.status(400).json({ error: 'Email or username already exists.'});
        }
        res.status(500).json({ error: `Error registering user: ${err.message}`});
        console.error(`Error registering user: ${err.message}`); // yup, also for DEV purposes
        return;
    }
};

// login of existing user
const login = async (req, res) => {
    try {
        const { identifier , password} = req.body;

        const user = await User.findOne({
            $or: [{email: identifier}, { username: identifier}]
        });
        if (!user) {
            res.status(404).json({ msg: 'User does not exist'});
            console.log('User does not exist');
            return;
        }
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
            res.status(401).json({ msg: 'Incorrect password' });
            console.log('Incorrect Password');
            return;
        }
        const token = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.status(200).json({ token });
        console.log(`Hi ${user.username}! What are you reading today?`)
        return;
    } catch (err) {
        res.status(500).json({ error: `Login error: ${err.message}`});
        console.error(`Login error: ${err.message}`);
        return;
    }
};

module.exports = {
    register,
    login
};