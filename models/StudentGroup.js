const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const studentGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    semester: {
        type: ObjectId,
        ref: 'Semester',
    }
});

module.exports = mongoose.model('StudentGroup',studentGroupSchema);