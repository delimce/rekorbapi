const express = require('express');
let router = express.Router();

router.get('/about', function(req, res) {
    res.send('About fiat');
  });
  
  module.exports = router;