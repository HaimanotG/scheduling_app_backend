const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const roomSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	isLab: {
		type: Boolean,
		default: false
	},
	department: {
		type: ObjectId,
		ref: 'Department'
	}
});

module.exports = mongoose.model('Room', roomSchema);