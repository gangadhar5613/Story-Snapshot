var express = require('express');
var router = express.Router();
let User = require('../models/User');



router.get('/', function(req, res, next) {
    res.render('dashboard');
  });



  
module.exports = router;