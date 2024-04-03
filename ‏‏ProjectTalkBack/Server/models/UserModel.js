const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: {
        type: String, require: true, unique: [true,'The user is exist! please login.'], minlength: [2, 'Username must be at least 2 characters long']
    },
    password: {
        type: String, require: true, minlength: [5, 'Password must be at least 5 characters long']
    },
},{ collection: 'user-data' })

const model = mongoose.model('UserData', User);

module.exports = model;