var express = require('express');
var router = express.Router();
var Job = require('../models/job');

// Job
router.get('/hirer', function(req, res){

	var query = Job.find()
		.sort('-createdAt')
		.exec()

	return query.then(function(jobDocs) {
			if(req.query.success==1){
				res.render('hirer',	{
					successmsg: 'You have succesfully created hirer_profile.',
					data: jobDocs
				});
			}
			return res.render('hirer', {data: jobDocs});
		}).then(null, function(err) {

			console.log(err)
		})
	
});

router.post('/hirer', ensureAuthenticated, function(req, res){
	console.log(req.body);
	
	// Validation
	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('description', 'Description is required').notEmpty();
	req.checkBody('category', 'Category is required').notEmpty();
	req.checkBody('amount', 'Amount is required').notEmpty();
	req.checkBody('type', 'Type is required').notEmpty();
	req.checkBody('number', 'Number required').notEmpty();
	req.checkBody('level', 'Level required').notEmpty();
	req.checkBody('dueDate', 'Due Date is required').notEmpty();
	req.checkBody('pay', 'Pay is required').notEmpty();
	
	var errors = req.validationErrors();

	console.log(errors)
	if(errors){
		res.render('hirer',{
			errors:errors
		});
	} else {
		console.log(req.body);
		var title = req.body.title;
		var description = req.body.description;
		var category = req.body.category;
		var userId = req.user._id;
		var amount = req.body.amount;
		var attachments = req.body.attachments;
		if (req.body.tags) {
			var tags = (req.body.tags).split(',');

		}
		var type = req.body.type;
		var number = req.body.number;
		var level = req.body.level;
	    var dueDate = new Date(req.body.dueDate);
    	var pay = req.body.pay;

		var newJob = new Job({
			title: title,
			description: description,
			category: category,
			userId: userId,
			amount: amount,
			attachments: attachments,
			tags: tags,
			type: type,
			number: number,
			level: level,
			dueDate: dueDate,
			pay: pay
		});

		return newJob.save()
			.then(function(jobDoc) {
				return res.status(200).json({
					success: true,
					data: jobDoc
				})
			}).then(null, function(err){
				console.log(err)
			})
	}
	
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;