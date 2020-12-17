var express = require('express');
var router = express.Router();
const auth = require('../middlewares/auth')

/* GET home page. */
router.get('/', auth.verifyLoggedInUser ,function(req, res, next) {
  res.render('userDashboard');
  
  console.log('hello')
  
});





module.exports = router;
