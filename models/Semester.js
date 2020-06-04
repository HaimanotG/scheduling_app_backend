const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const semesterSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	batch: {
		type: ObjectId,
		ref: 'Batch'
	},
	courses: [{
		type: ObjectId,
		ref: 'Course'
	}]
});

module.exports = mongoose.model('Semester', semesterSchema);