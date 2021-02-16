'use strict';

const scrapeIt = require("scrape-it");
const dolarMonitorUrl = "https://monitordolarvenezuela.com/monitor-pantalla-completa";

exports.getUsdPrice = async function () {
    let info = await scrapeIt(dolarMonitorUrl, {
        title: "title"
    });
    return convertTitleToPrice(info.data) //Bs
}

const convertTitleToPrice = function (data) {
    let title = data.title.split("-");
    let price = title[0].trim().split(" ");
    return Number(price[1].replace(/./g, '').replace(',', '.'))
}


