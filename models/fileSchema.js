const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const fileSchema = new Schema({
	filename: { type: String },
	url: { type: String }
})

module.exports = fileSchema