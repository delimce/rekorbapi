const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const investmentSchema = new Schema({
    coin: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        default: null,
        required: true
    },
    quantity: {
        type: Number,
        default: null,
        required: true
    },
    fee: {
        type: Number,
        default: 0.0
    },
    user: {
        type: Map,
        of: String
    },
    date: {
        type: Date,
        default: null
    },
}, { timestamps: true })
const invest = mongoose.model('investment', investmentSchema);
module.exports = invest;