var mongoose = require('mongoose');
const fileSchema = require('./fileSchema');

// Job Schema
var JobSchema = mongoose.Schema({
	title: { type: String, required: true},
	description: { type: String, required: true},
	category: { type: String, enum:['Web Development', 'Mobile Development', 'Creative Writing', 'Designing', 'Sales & Marketing', 'Accounting'], required: true},
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	amount: { type: Number, required: true},
	attachments: [ fileSchema ],
	tags: [ { type: String } ],
	type: { type: String, enum:['One-time Project', 'Ongoing Project'], required: true },
	pay: { type: String, enum:['Pay by hour', 'Pay by project']},
	number: { type: Number },
	level: { type: String, enum:['Entry Level', 'Intermediate Level', 'Expert Level'], required: true},
	dueDate: { type: Date, required: true },
	createdAt: { type: Date },
});

JobSchema.pre('save', function(next){
	var currentTime 	= new Date()
	if (!this.created_at) { this.created_at = currentTime }
	next()
})

JobSchema.index({ title: 'text', tags: 'text' }, {name: 'Assignment text index', weights: {title: 10, tags: 5}})

var  Job = module.exports = mongoose.model('Job', JobSchema);




