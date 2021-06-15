const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const codes = require('../../public/enums/fiatCodes.json');

const fiatPriceSchema = new Schema({
    code: {
        type: String,
        enum: codes,
        required: true,
        index: true
    },
    currency: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        required: true
    },
    source: {
        type: String,
        required: false
    },
}, { timestamps: true })

const fiatPrices = mongoose.model('fiatPrices', fiatPriceSchema);
module.exports = fiatPrices;