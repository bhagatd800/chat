const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const config = require('../config');

const User = require('../models/user');

// Register
router.get('/register', function(req, res){
	var country = require('../data/country');
	//console.log(country);
	res.render('register', {country: country});
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	//console.log(req.body);
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
    var country = req.body.country;
    var skill = req.body.skill;
	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('skill', 'Please enter your primary skill').notEmpty();

	var errors = req.validationErrors();

	//console.log(errors)
	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password, 
			profilePic: {
                filename: 'avatar.png',
                url: config.serverUri + '/file/' + 'avatar.png'
            },
			skill: skill
		});
		
		//console.log()
		User.createUser(newUser, function(err, user){
			if(err) {
				//console.log(err)
				if (err.code == 11000) {
					var errors = [{
						msg: 'Email address already exits'
					}]
					res.render('register',{
						errors: errors
					});
				} else {
					res.render('register',{
						errors: [err]
					});
				}
			} else {
				//console.log(user);
				req.flash('success_msg', 'You are registered and can now login');
				res.redirect('/users/login');
			}

			
		});

        
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login', passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {

    res.redirect('/');
   // req.session.users = req.body;
    //console.log(req.session.users);
});

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;