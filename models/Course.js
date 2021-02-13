const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const courseSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	code: {
		type: String,
		default: 'CourseCode',
		required: true
	},
	totalCreditHours: {
		type: Number,
		required: true
	},
	labCreditHours: {
		type: Number
	},
	semester: {
		type: ObjectId,
		ref: 'Semester'
	},
	teacher: {
		type: ObjectId,
		ref: 'Teacher'
	},
	// isTeacherBorrowed: {
	// 	type: Boolean,
	// 	default: false
	// },
});

module.exports = mongoose.model('Course', courseSchema);