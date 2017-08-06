var express = require('express');
var router = express.Router();
var userModel = require('../models/user')

router.get('/', ensureAuthenticated, (req, res) => {
	console.log('List route', req.user)
	userModel.find({})
		.then(function(userDocs) {
			res.render('list', {freelancers: userDocs});
		})
})



function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router