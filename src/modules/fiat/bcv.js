'use strict';

const cheerio = require('cheerio');
const got = require('got');

const bcvUrl = "http://www.bcv.org.ve";

module.exports = {

    async getUsdPrice(){
        let info = await got(bcvUrl).then(response => {
            const $ = cheerio.load(response.body);
            let content = $('#dolar').children().last().find('strong').text().trim();
            return content;
            
          })
        return Number(info.replace(/\./g,'').replace(',', '.'));
    }
    

}