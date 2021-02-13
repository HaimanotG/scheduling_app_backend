const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const schedule = new mongoose.Schema({
	department: { type: ObjectId, ref: 'Department' },
	code: { type: String },
	batch: { type: ObjectId, ref: 'Batch' },
	course: { type: String },
	creditHours: { type: String },
	time: { type: String },
	room: { type: String },
	teacher: { type: String },
	teacherId: { type: ObjectId, ref: 'Teacher' }
})
module.exports = mongoose.model('Schedule', schedule);