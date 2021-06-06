const express = require('express');
const auth = require('../../middlewares/auth');

let router = express.Router();

const localbtc = require("../../modules/crypto/localbtc");
const utils = require("../../modules/app/utils");


router.get('/localbtc/posts/currency/:cur', async function (req, res) {
  let params = await req.body;
  let posts = await localbtc.getTradingPostsByCurrency(params.type, req.params.cur, params.page);
  let final = posts.results.filter((post) => {
    return (post.country == params.location.toUpperCase()
      && (post.bank && utils.anyElementsInText(post.bank.toLowerCase(), params.bank.toLowerCase()))
      || (post.msg && utils.anyElementsInText(post.msg.toLowerCase(), params.bank.toLowerCase())))
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
  try {
    let trader = await localbtc.getTraderProfile(req.params.username)
    res.json(trader);
  } catch (err) {
    res.status(400);
    res.send("trader not found");
  }

});

router.post('/localbtc/new', auth, async function (req, res) {
  let data = await req.body;
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  let result = await localbtc.saveNewTradeWithUser(data, token);
  if (!result.success) {
    res.status(400);
  }
  res.json(result);
});

const localbtcLocation = function (params, posts) {
  let final = posts.results.filter((post) => {
    return post.currency == params.currency.toUpperCase()
      && (params.amount >= post.min && params.amount <= post.max)
  })

  if (params.bank != undefined && params.bank.trim() != "") {
    final = final.filter((post) => {
      return (post.bank && utils.anyElementsInText(post.bank.toLowerCase(), params.bank.toLowerCase()))
        || (post.msg && utils.anyElementsInText(post.msg.toLowerCase(), params.bank.toLowerCase()))
    })
  }
  return final;
}
module.exports = router;