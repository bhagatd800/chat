const mongoose     = require('mongoose');
const bcrypt       = require('bcryptjs');

const fileSchema   = require('./fileSchema');

// User Schema
var UserSchema     = mongoose.Schema({
	username: { type: String, index:true },
	password: { type: String },
	email: { type: String, unique: true },
	name: { type: String },
	about: { type: String },
	experience: { type: String },
	country: { type: String },
	type: { type: String, enum: ['freelancer', 'hirer'] },
	rating: { type: Number, min: 0, max: 5 },
	profilePic: fileSchema,
	skill: [{type: String}]
});

UserSchema.index({name: 'text'}, {name: 'Username search'});

var  User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}



module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.getUserData = function(callback){

User.find(callback)

}