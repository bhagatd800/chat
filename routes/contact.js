var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/contact_us', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
