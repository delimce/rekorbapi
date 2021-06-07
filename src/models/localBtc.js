const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const localBtcSchema = new Schema({
    type: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    fee: {
        type: Number,
        default: 0.0
    },
    bank: {
        type: String,
    },
    timezone: {
        type: String,
    },
    attempt: {
        type: Number,
        default: 0
    },
    notified: {
        type: Boolean,
        default: false
    },
    finished: {
        type: Boolean,
        default: false
    },
    user: {
        type: Map,
        of: String
    },
}, { timestamps: true });
const LocalBtc = mongoose.model('LocalBtc', localBtcSchema);
module.exports = LocalBtc;