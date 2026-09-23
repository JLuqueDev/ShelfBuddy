const User = require('./../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// creat new user 
const register = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email: email });
        if (user) {
            res.status(400).json({ msg: 'User already exists in the DB!'});
            console.log('User already exists in the DB!');  // for DEV purposes
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });
        await user.save();
        res.status(201).json({msg: 'User created successfully!'});
        console.log('User created successfully!'); // for DEV purposes
        return;
    } catch (err) {
        res.status(500).json({ error: `Error registering user: ${err.message}`});
        console.error(`Error registering user: ${err.message}`); // yup, also for DEV purposes
        return;
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
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
        console.log('User logged in succesfully, token created')
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