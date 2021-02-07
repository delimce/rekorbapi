'use strict';

const axios = require('axios');

exports.getInfoArg = async function () {
    let result = {}
    try {
        result = await axios({
            method: 'get',
            timeout: 40000,
            url: 'https://www.cronista.com/MercadosOnline/json/getValoresCalculadora.html'
        })
    } catch (error) {
        console.log(error)
    } finally {
        return result.data;
    }
}

const getArsCurrencies = async function (json) {
    return json.filter((el) => {
        return el.Nombre.includes('DÓLAR');
    })
}

exports.getArsCurrencies = getArsCurrencies