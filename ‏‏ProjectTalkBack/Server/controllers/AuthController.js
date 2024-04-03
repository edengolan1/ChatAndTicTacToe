const User = require('../models/UserModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    if (!jwtkey) {
        throw new Error("JWT_SECRET_KEY is not defined in environment variables");
    }
    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
}

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({username});
        if(!user){
            return res.status(400).json("Invalid email or password");
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword){
            return res.status(400).json("Invalid email or password");
        }
        const token = createToken(user._id);
        res.status(200).json({ _id: user._id, username, token });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ status: 'error', error: err.message }); 
    }
}

const register = async (req, res) => {
        console.log(req.body);
        const { username, password } = req.body;
        try {
            const user = await User.findOne({ username });
            if (user) {
                return res.json({ status: 'error', error: 'Username already exists' });
            }
            if (username.length < 2) {
                return res.json({ status: 'error', error: 'Username must be at least 2 characters long' });
            }
            if (password.length < 5) {
                return res.json({ status: 'error', error: 'Password must be at least 5 characters long' });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await User.create({
                username,
                password: hashedPassword
            });
            const token = createToken(newUser._id);
            res.status(200).json({ _id: newUser._id, username, token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 'error', error: err.message });
        }
}

const findUser = async(req,res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        console.error(err);
        res.status(500).json({ status: 'error', error: err.message });
    }
}

const getUsers = async(req,res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(err);
        res.status(500).json({ status: 'error', error: err.message });
    }
};

module.exports = {
    login,
    register,
    findUser,
    getUsers
};
