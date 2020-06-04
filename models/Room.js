const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const roomSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	department: {
		type: ObjectId,
		ref: 'Department'
	}
});

module.exports = mongoose.model('Room', roomSchema);