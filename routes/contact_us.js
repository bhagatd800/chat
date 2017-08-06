var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/contact_us', function(req, res, next) {
  res.render('contactus', { title: 'Express' });
});

module.exports = router;
