const mongoose = require('mongoose');

// Creating a User Schema
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String
    },


    email: {
        type: String,
        required: true,
        unique: true
    },

    gender: {
        type: String,
        required: true
    },

    job_title: {
        type: String,
    },
},
    {
        timestamps: true
    });

// Creating a model.
const User = mongoose.model('User', userSchema);

module.exports = User;