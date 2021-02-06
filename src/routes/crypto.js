const express = require('express');
let router = express.Router();

router.get('/about', function(req, res) {
    res.json('About crypto');
  });
  
  module.exports = router;