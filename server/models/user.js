const mongoose = require("mongoose");
const {Schema} = require('mongoose');

const userSchema = new Schema(
    {
        user_id: {
            type: String,
        },
        user_name: {
            type: String,
        },
        email: {
            type: String,
        },
        mobile_no: {
            type: String,
        },
        
    },
);

const User = mongoose.model("user", userSchema);

module.exports = User;
