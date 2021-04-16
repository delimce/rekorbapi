const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
    type: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    userId: {
        type: [Schema.Types.ObjectId],
        required: true
    },
    coin: {
        id: String,
        required: true
    },
    currency: {
        type: String,
        enum: ['usd', 'eur'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    intent:{
        type:Number,
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

}, { timestamps: true })


const TradeOrder = mongoose.model('TradeOrder', tradeSchema);
module.exports = TradeOrder;