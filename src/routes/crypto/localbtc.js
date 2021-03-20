const express = require('express');

let router = express.Router();

const localbtc = require("../../modules/crypto/localbtc");


router.get('/localbtc/posts/currency/:cur', async function (req, res) {
  let params = await req.body;
  let posts = await localbtc.getTradingPostsByCurrency(params.type, req.params.cur, params.page);
  let final = posts.results.filter((post) => {
    return (post.country == params.location.toUpperCase()
      && (post.bank && post.bank.toLowerCase().includes(params.bank.toLowerCase()))
      || (post.msg && post.msg.toLowerCase().includes(params.bank.toLowerCase())))
      && (params.amount >= post.min && params.amount <= post.max)
  })
  res.json(final);
});


router.get('/localbtc/posts/location/:code', async function (req, res) {
  let params = await req.body;
  let posts = await localbtc.getTradingPostsByLocation(params.type, req.params.code, params.name, params.page);
  let final = localbtcLocation(params, posts);
  res.json(final);
});

router.put('/localbtc/posts/location/:code', async function (req, res) {
  let params = await req.body;
  let posts = await localbtc.getTradingPostsByLocation(params.type, req.params.code, params.name, params.page);
  let final = localbtcLocation(params, posts);
  res.json(final);
});

router.get('/localbtc/trader/:username', async function (req, res) {
  let trader = await localbtc.getTraderProfile(req.params.username)
  res.json(trader);
});

const localbtcLocation = function (params, posts) {
  let final = posts.results.filter((post) => {
    return post.currency == params.currency.toUpperCase()
      && (params.amount >= post.min && params.amount <= post.max)
  })

  if (params.bank != undefined && params.bank.trim() != "") {
    final = final.filter((post) => {
      return post.bank.toLowerCase().includes(params.bank.toLowerCase())
        || post.msg.toLowerCase().includes(params.bank.toLowerCase())
    })
  }
  return final;
}
module.exports = router;