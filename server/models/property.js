const mongoose = require("mongoose");
const {Schema} = require('mongoose');

const propertySchema = new Schema(
    {
        user_id: {
            type: String,
        },
        zip_code: {
            type: String,
        },
        register_name: {
            type: String,
        },
        location: {
            type: String,
        },
        price: {
            type: Number,
        },
        area: {
            type: Number,
        },
        type: {
            type: Number,
        },
        status: {
            type: String,
        },
        thumbnail_url: {
            type: String,
        },
        longitude: {
            type: Number,
        },
        latitude: {
            type: Number,
        },
        trade_time: {
            type: Date,
        },
        token_available: {
            type: Number,
            default: 100,
        },
        max_token: {
            type: Number,
            default: 100,
        },
    },
);

const Property = mongoose.model("property", propertySchema);

module.exports = Property;
