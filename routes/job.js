var express = require('express');
var router = express.Router();
var jobModel = require('../models/job')

router.get('/', ensureAuthenticated, (req, res) => {
	console.log('List route', req.user)
	// userModel.find({})
	// 	.then(function(userDocs) {
	// 		res.render('list', {freelancers: userDocs});
	// 	})
	res.render('job')
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