const User = require('./../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email: email });
        if (user) return res.status(400).json({
            msg: 'User already exists in the DB'      
        }); console.log('User already exists in the DB');
        const hashedPassword = await bcrypt.hash(password, 10)
        user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });
        await user.save();
        return res.status(201).json({
            msg: 'User created successfully!'
        }); console.log('User created sucessfully!');
    } catch (err) {
        return res.status(500).json({
            error: `Error registering user: ${err.message}`
        });
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) await res.status(404).json({
            msg: 'User does not exist'
        });
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return res.status(401).json({
            msg: 'Incorrect password'
        });
        const token = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        return res.status(200).json({
            token
        });
    } catch (err) {
        return res.status(500).json({
            error: `Login error: ${err.message}`
        });
    }
};

module.exports = {
    register,
    login
};