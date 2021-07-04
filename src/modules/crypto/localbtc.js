'use strict';
const axios = require('axios');
const date = require("date-and-time");
const LocalBtcModel = require('../../models/localBtc');
const userModule = require('../../modules/users/user');
const utils = require('../app/utils');
const BASE_URL = "https://localbitcoins.com/";
const MAX_TIMEOUT = 7000

module.exports =
{
    getStatusLabel: function (minutes) {
        let status = "OFFLINE";
        if (minutes >= 0 && minutes < 17) {
            status = "ONLINE";
        } else if (minutes >= 17 && minutes < 223) {
            status = "AWAY";
        }
        return status;
    },
    getOnlineStatus: function (datetime) {
        let now = new Date();
        let postDate = new Date(datetime);
        let mins = date.subtract(now, postDate).toMinutes();
        return this.getStatusLabel(mins);
    },
    getLocalbtcObject: function (localBtc) {
        let data = localBtc;
        let resp = {};
        resp.pagination = data.pagination;
        resp.results = [];
        let list = [];
        if (Number(data.data.ad_count) > 0) list = data.data.ad_list;

        list.forEach(res => {
            if (res.data.visible) {
                let post = res.data;
                post.profile.last_online = this.getOnlineStatus(post.profile.last_online);
                let local = {
                    profile: post.profile,
                    type: post.trade_type,
                    bank: post.bank_name,
                    msg: post.msg,
                    currency: post.currency,
                    min: post.limit_to_fiat_amounts
                        ? Number(post.limit_to_fiat_amounts)
                        : Number(post.min_amount),
                    max: post.max_amount_available
                        ? Number(post.max_amount_available)
                        : Number(post.max_amount),
                    price: parseFloat(post.temp_price),
                    location: post.location_string,
                    country: post.countrycode,
                    url: res.actions.public_view,
                };
                resp.results.push(local);
            }
        })
        return resp;
    },
    getTradingPostsByCurrency: async function (op, currency, page) {
        let cur = String(currency);
        let current = page > 1 && page != undefined ? "?page=" + Number(page) : "";
        let trade = op.toLowerCase() == "sell" ? "sell" : "buy";

        let url_localbtc =
            BASE_URL +
            trade +
            "-bitcoins-online/" +
            cur.toUpperCase() +
            "/.json" +
            current;

        let info = await axios({
            method: 'get',
            timeout: MAX_TIMEOUT,
            url: url_localbtc
        })

        let resp = this.getLocalbtcObject(info.data);
        return resp;
    },
    getTradingPostsByLocation: async function (
        op,
        location,
        country,
        page
    ) {
        let local = String(location);
        let name = String(country);
        let current = page > 1 && page != undefined ? "?page=" + Number(page) : "";
        let trade = op.toLowerCase() === "sell" ? "sell" : "buy";

        let url_localbtc =
            BASE_URL +
            trade +
            "-bitcoins-online/" +
            local.toLowerCase() +
            "/" +
            name.toLowerCase() +
            "/.json" +
            current;

        let info = await axios({
            method: 'get',
            timeout: MAX_TIMEOUT,
            url: url_localbtc
        })

        let resp = this.getLocalbtcObject(info.data);
        return resp;
    },
    getTraderProfile: async function (trader) {
        let url_localbtc = BASE_URL + "api/account_info/" + trader + "/";
        let info = await axios({
            method: 'get',
            timeout: MAX_TIMEOUT,
            url: url_localbtc
        });
        return info.data;
    },
    saveNewTrade: async function (lbtcTrade) {
        try {
            const lbtc = new LocalBtcModel(lbtcTrade);
            let result = await lbtc.save();
            return utils.setMongooseResponse(true, "trade created", result);
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }

    },
    saveNewTradeWithUser: async function (lbtcTrade, token) {
        let user = await userModule.getByToken(token)
        if (user) {
            let data = {};
            data.name = user.name;
            data.email = user.email;
            lbtcTrade.user = data;
            return this.saveNewTrade(lbtcTrade);
        }
    }, getTradesByUser: async function (token) {
        try {
            const user = await userModule.getByToken(token);
            const userPosts = await LocalBtcModel.find({ 'user.email': user.email }).exec();
            return utils.setMongooseResponse(true, "", userPosts);
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }
    }

}