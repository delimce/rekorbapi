'use strict';
const UserModel = require('../models/user');


module.exports = {
    save: async (data) => {
        const user = new UserModel(data);
        return await user.save();
    },
    getById: async (id) => {
        return await UserModel.findById(id)
    },
    getByToken: async (token) => {
        return (await UserModel.findOne({ token: token })).toObject()
    },
    getDataByEmail: async (email) => {
        let data = await UserModel.findOne({ email: email.toLowerCase(), active: true });
        return (!data) ? false : data;
    },
    deleteByEmail:async (email)=>{
        await UserModel.deleteOne({ email: email });
    },
    setDocByFilters: async (filters, data) => {
        await UserModel.findOneAndUpdate(filters, data);
    }
}