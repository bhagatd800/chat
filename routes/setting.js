var express = require('express');
var router = express.Router();
var userModel = require('../models/user')


router.get('/', ensureAuthenticated, function(req, res, next) {
	var country = require('../data/country');
	var data = {country: country};
	console.log(req.query.alert)
	if (req.query.alert) {
		data.alert = JSON.parse(req.query.alert);
	}
	console.log(data)
	res.render('setting', data);
})

router.post('/', ensureAuthenticated, function(req, res) {
	var data = req.body;
	var username = req.user.username;

	if (data.skill) {
		data.skill = data.skill.split(',');
	}
	delete data.password
	delete data.username

	userModel.findOneAndUpdate({username: username}, data, {safe: true, new: true}, function(err, doc) {
		if (err) {
			var alert = {
				type: 'danger',
				strong: 'Error!!',
				msg: 'Error occured while editing profile.'
			}
			res.redirect('/setting?alert='+JSON.stringify(alert))
		}
		var alert = {
			type: 'success',
			strong: 'Success!!',
			msg: 'You have successfully edited profile.'
		}
		res.redirect('/setting?alert='+JSON.stringify(alert))
	});
})


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;