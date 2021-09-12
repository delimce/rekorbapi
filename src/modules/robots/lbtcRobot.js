'use strict'
const localBtcModule = require('../crypto/localbtc')
const localBtcRepository = require('../../repositories/localBtcRepository')
const utils = require('../app/utils');
const geckoModule = require('../crypto/coingecko');
const dToday = require('../fiat/dolarToday');
const currencies = require('../../../public/enums/currencies.json');
const email = require('../app/email');
const jsRender = require('jsrender');

module.exports = {
    findPosts: async function () {
        const posts = await localBtcRepository.find({ 'notified': false });
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
                await localBtcRepository.updateDataById(el._id, updateData);
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
        let posts = await localBtcModule.getTradingPostsByLocation(search.type, search.location, country, 1)
        if (posts.results.length > 0) {
            posts.results.filter((post) => {
                return ((post.bank && utils.anyElementsInText(post.bank.toLowerCase(), search.bank.toLowerCase()))
                    || (post.msg && utils.anyElementsInText(post.msg.toLowerCase(), search.bank.toLowerCase())))
                    && (search.amount >= post.min && search.amount <= post.max)
                    && post.profile.last_online === "ONLINE"
            }).every(post => {
                if (this.profitPrice(search, post, btcPrice)) {
                    result = post;
                    return false;
                }
                return true;
            });
        }
        return result;
    },
    getCurrencyPriceOfBTC: async function (currency) {
        let price = 0;
        const btcPriceData = await geckoModule.getPricesByIds(['bitcoin']);
        const currencyLowerValue = currency.toLowerCase();
        switch (currencyLowerValue) {
            case currencies[0].id: //usd
            case currencies[1].id: //eur
                price = btcPriceData.bitcoin[currencyLowerValue];
                break;
            case currencies[2].id://ves
                let vesFactor = await dToday.getUsdPriceFromDb();
                price = Number(btcPriceData.bitcoin[currencies[0].id]) * vesFactor;
                break;
            default:
                price = Number(btcPriceData.bitcoin[currencies[0].id]); //usd
                break;
        }
        return Math.trunc(price);
    }, getPercentageFeeBtc(price) {
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
    profitPrice: function (search, post, btcPrice) {
        const price = Number(post.price) / Number(btcPrice)
        const currentFee = this.getPercentageFeeBtc(price);
        this.updateBestFee(currentFee, search, price)
        return (search.type.toUpperCase() === 'BUY') ? (currentFee <= search.fee) : (currentFee >= (search.fee * -1));
    }, updateBestFee: async function (fee, search, price) {
        //update best fee
        if (!search.bestFee ||
            (search.bestFee > fee && search.type.toUpperCase() === 'BUY') ||
            (search.bestFee < fee && search.type.toUpperCase() === 'SELL')) {
            await localBtcRepository.updateDataById(search._id, {
                bestFee: fee,
                bestPrice: price.toFixed(2),
                bestDate: new Date()
            });
        }
    },
    notifyWithEmail: async function (post, search) {
        email.setSubject("Your Localbitcoins post has been Found");
        email.setTo(search.user.get('email'));
        const emailData = {
            url: post.url,
            country: post.country,
            currency: post.currency,
            type: post.type,
            fee: search.fee,
            date: utils.getDateNow(),
            price: post.price,
            price2: search.amount,
            title: post.bank,
            msg: post.msg,
            name: search.user.get('name')
        }
        let template = jsRender.templates('./public/templates/emails/lbtcposts.html');
        let html = template.render(emailData);
        email.setHtml(html);
        await email.send();
    }
};