const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const schedule = new mongoose.Schema({
	department: {
		type: ObjectId,
		ref: 'Department',
		batch: [{
			type: ObjectId,
			ref: 'Batch',
			day: [{
				day: {
					type: String,
					enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
				},
				time: [{
					time: {
						type: String
					},
					course: {
						type: ObjectId,
						ref: 'Course'
					},
					teacher: {
						type: ObjectId,
						ref: 'Teacher'
					},
				}],
				
			}],
		}],
	}
})

module.exports = mongoose.model('Schedule', schedule);