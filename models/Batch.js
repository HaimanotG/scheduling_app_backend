const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const batchSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	department: {
		type: ObjectId,
		ref: 'Department'
	},
	classRoom: {
		type: ObjectId,
		ref: 'Room',
	},
	labRoom: {
		type: ObjectId,
		ref: 'Room',
	},
	semesters: [{
		type: ObjectId,
		ref: 'Semester'
	}]
});

module.exports = mongoose.model('Batch', batchSchema);