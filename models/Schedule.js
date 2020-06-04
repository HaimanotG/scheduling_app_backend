const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const schedule = new mongoose.Schema({
	department: {
		type: ObjectId,
		ref: 'Department'
	},
});

module.exports = mongoose.model('Schedule', schedule);