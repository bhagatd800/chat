var express = require('express');
var router = express.Router();
var userModel = require('../models/user')




// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

router.get('/register', function(req, res){
	res.render('register');
});

//Agreement
router.get('/agreement', ensureAuthenticated, function (req, res) {
	res.render('agreement');
});

//Get Hirer
router.get('/hirer', ensureAuthenticated, function (req, res) {
	res.render('hirer');
});


//Payment
router.get('/payment', ensureAuthenticated, function (req, res) {
	res.render('payment');
});



//contact us
router.get('/contactus', ensureAuthenticated, function (req, res) {
	res.render('contactus')
});

//browse skills
router.get('/browse_skills', function (req, res) {
	res.render('browse_skills')
});

//link
router.get('/link', ensureAuthenticated, function (req, res) {
	res.render('link');
});


//about
router.get('/about_us', function (req, res) {
	res.render('about_us');
});

//edit
router.get('/comment_box', function (req, res) {
	res.render('comment_box');
});

//Find
router.get('/find', ensureAuthenticated, function (req, res) {
	res.render('find');
});

//Hire

router.get('/hire', ensureAuthenticated, function (req, res) {
	res.render('hire');
});


//Work
router.get('/work', ensureAuthenticated, function (req, res) {
	res.render('work');
});


//Pay
router.get('/pay', ensureAuthenticated, function (req, res) {
	res.render('pay');
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		
		req.session.users = req.user;
		console.log(req.session.users);
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;