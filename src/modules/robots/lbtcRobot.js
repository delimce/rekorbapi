'use strict'
const localbtcModule = require('../crypto/localbtc')
const localBtcModel = require('../../models/localBtc')
const utils = require('../app/utils');
const geckoModule = require('../crypto/coingecko');
const dtoday = require('../fiat/dolarToday');
const currencies = require('../../../public/enums/currencies.json');
const email = require('../app/email');
const jsrender = require('jsrender');

module.exports = {
    findPosts: async function () {
        const posts = await localBtcModel.find({ 'notified': false });
        let state = {
            posts: 0,
            notified: 0,
            time: 0.0,
        }
        state.posts = posts.length;
        const startTime = Date.now()
        if (posts.length > 0) {
            let i = 0;
            while (i < posts.length) {
                let el = posts[i];
                let postData = await this.findFirstResultPost(el);
                let updateData = { attempt: el.attempt + 1 }
                if (postData) {
                    //notify user
                    updateData.notified = true;
                    state.notified += 1;
                    this.notifyWithEmail(postData, el);
                }
                //saving attempt & status
                await localBtcModel.findByIdAndUpdate({ _id: el._id }, updateData);
                i++;
            }
        }
        const stopTime = Date.now()
        state.time = (stopTime - startTime) / 1000;
        return state;
    },
    findFirstResultPost: async function (search) {
        const country = utils.getCountryByCode(search.location).name;
        const btcPrice = await this.getCurrencyPriceOfBTC(search.currency);
        let result = false;
        let posts = await localbtcModule.getTradingPostsByLocation(search.type, search.location, country, 1)
        if (posts.results.length > 0) {
            result = posts.results.find((post) => {
                return ((post.bank && utils.anyElementsInText(post.bank.toLowerCase(), search.bank.toLowerCase()))
                    || (post.msg && utils.anyElementsInText(post.msg.toLowerCase(), search.bank.toLowerCase())))
                    && (search.amount >= post.min && search.amount <= post.max)
                    && this.profitPrice(search, post, btcPrice) && post.profile.last_online === "ONLINE"
            });
        }
        return result;
    },
    getCurrencyPriceOfBTC: async function (currency) {
        let price = 0;
        const btcPriceData = await geckoModule.getPricesByIds(['bitcoin']);
        switch (currency) {
            case currencies[0].id: //usd
            case currencies[1].id: //eur
                price = btcPriceData.bitcoin[currency];
                break;
            case currencies[2].id://ves
                let vesFactor = await dtoday.getUsdPriceFromDb();
                price = Number(btcPriceData.bitcoin[currencies[0].id]) * vesFactor;
                break;
            default:
                price = Number(btcPriceData.bitcoin[currencies[0].id]); //usd
                break;
        }
        return Math.trunc(price);
    }, getPercentageFeeBtc(postPrice, btcPrice) {
        let price = Number(postPrice) / Number(btcPrice)
        let x1 = Number(price.toFixed(2));
        let percent = 0;
        if (x1 >= 1) {
            let int_part = Math.trunc(x1);
            percent = x1 - int_part; //UP
        } else {
            percent = (1 - x1) * -1 //DOWN; 
        }
        return Number((percent).toFixed(2) * 100);
    },
    profitPrice(search, post, btcPrice) {
        return (search.type === 'BUY') ?
            (this.getPercentageFeeBtc(post.price, btcPrice) <= search.fee)
            : (this.getPercentageFeeBtc(post.price, btcPrice) >= (search.fee * -1));
    },
    notifyWithEmail: async function (post, search) {
        email.setSubject("Your Localbitcoins post has been Found");
        email.setTo(search.user.get('email'));
        const emailData = {
            url:post.url,
            country:post.country,
            currency:post.currency,
            type:post.type,
            fee:search.fee,
            date:utils.getDateNow(),
            price:post.price,
            price2:search.amount,
            title:post.bank,
            msg:post.msg,
            name:search.user.get('name')
        }
        let template = jsrender.templates('./src/templates/emails/lbtcposts.html');
        let html = template.render(emailData);
        email.setHtml(html);
        await email.send();
    }
};