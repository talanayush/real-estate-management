const mongoose = require("mongoose");
const {Schema} = require('mongoose');

const bidSchema = new Schema(
    {
        user_id: {
            type: String,
        },
        property_id: {
            type: String,
        },
        price: {
            type: String,
        },
        token_count: {
            type: Number,
        },
        status: {
            type: String,
            default: "pending"
        },
    },
);

const Bid = mongoose.model("bid", bidSchema);

module.exports = Bid;
