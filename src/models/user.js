const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    active: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        default: null,
        index: true
    }
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true, dropDups: true });

const User = mongoose.model('User', userSchema);
module.exports = User;