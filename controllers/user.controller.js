const User = require('./../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// creat new user 
const register = async(req, res) => {
    try {
        const { username, email, password } = req.body;

        const formatedEmail = email.toLowerCase().trim();
        const formatedUsername = username.toLowerCase().trim();

        let existingUser = await User.findOne({ 
            $or: [{email: formatedEmail}, { username: formatedUsername }] });
        
        if (existingUser) {
            const input = existingUser.email === formatedEmail ? 'Email' : 'Username';
            console.log(`${input} is already registered!`); 
            return res.status(400).json({ msg: `${input} already exists in the DB!`});
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({
            username: formatedUsername,
            email: formatedEmail,
            password: hashedPassword
        });

        await user.save();
        console.log(`Hi ${user.username}! Welcome to ShelfBuddy!`);
        return res.status(201).json({msg: 'User created successfully!'});
        
    } catch (err) {
        if (err.code === 11000) {
            console.log('Email or username already exists.');
            return res.status(400).json({ error: 'Email or username already exists.'});
        }
        console.error(`Error registering user: ${err.message}`);
        return res.status(500).json({ error: `Error registering user: ${err.message}`}); 
    }
};

// login of existing user
const login = async (req, res) => {
    try {
        console.log('Login Request Body:', req.body);
        const { identifier , password} = req.body;

        const formatedIdentifier = identifier.toLowerCase().trim();

        const user = await User.findOne({
            $or: [
                {email: formatedIdentifier}, 
                { username: formatedIdentifier}
            ]
        });
        console.log('User found in DB:', user); 
        
        if (!user) {
            console.log('User does not exist');
            return res.status(404).json({ msg: 'User does not exist'});
        }
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
            console.log('Incorrect Password');
            return res.status(401).json({ msg: 'Incorrect password' });   
        }
        const token = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        console.log(`Hi ${user.username}! What are you reading today?`)
        return res.status(200).json({ token });
    } catch (err) {
        console.error(`Login error: ${err.message}`);
        return res.status(500).json({ error: `Login error: ${err.message}`});
    }
};

module.exports = {
    register,
    login
};