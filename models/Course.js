const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const courseSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	credit_hours: {
		type: String,
		required: true
	},
	semester: {
		type: ObjectId,
		ref: 'Semester'
	}
});

module.exports = mongoose.model('Course', courseSchema);