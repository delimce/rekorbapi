const express = require('express');
const auth = require('../../middleware/auth');
const logger = require('../../modules/app/logger');

let router = express.Router();

const localBtc = require("../../modules/crypto/localbtc");
const utils = require("../../modules/app/utils");


router.put('/localbtc/posts/currency/:cur', async function (req, res) {
  let params = await req.body;
  let posts = await localBtc.getTradingPostsByCurrency(params.type, req.params.cur, params.page);
  let final = posts.results.filter((post) => {
    return (post.country === params.location.toUpperCase()
      && (post.bank && utils.anyElementsInText(post.bank.toLowerCase(), params.bank.toLowerCase()))
      || (post.msg && utils.anyElementsInText(post.msg.toLowerCase(), params.bank.toLowerCase())))
      && (params.amount >= post.min && params.amount <= post.max)
  })
  res.json(final);
});


router.put('/localbtc/posts/location/:code', async function (req, res) {
  let params = await req.body;
  let posts = await localBtc.getTradingPostsByLocation(params.type, req.params.code, params.name, params.page);
  let final = localbtcLocation(params, posts);
  res.json(final);
});

router.get('/localbtc/trader/:username', async function (req, res) {
  try {
    let trader = await localBtc.getTraderProfile(req.params.username)
    res.json(trader);
  } catch (err) {
    logger.error(err);
    res.status(400);
    res.send("trader not found");
  }

});

router.post('/localbtc/new', auth, async function (req, res) {
  let data = await req.body;
  const token = utils.getTokenByRequest(req);
  let result = await localBtc.saveNewTradeWithUser(data, token);
  if (!result.success) {
    logger.error(result.message);
    res.status(400);
  }
  res.json(result);
});


router.put('/localbtc/delete/:idTrade', auth, async function (req, res) {
  let tradeId = req.params.idTrade
  let result = await localBtc.deleteTradeById(tradeId);
  if (!result.success) {
    logger.error(result.message);
    res.status(400);
  }
  res.json(result);
})


router.get('/localbtc/trades', auth, async function (req, res) {
  const token = utils.getTokenByRequest(req);
  const result = await localBtc.getTradesByUser(token);
  if (!result.success) {
    logger.error(result.message);
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