const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const teacherRequestSchema = new mongoose.Schema({
    course: {
        type: ObjectId,
        ref: 'Course'
    },
    teacher: {
        type: ObjectId,
        ref: 'Teacher'
    },
    from: {
        type: ObjectId,
        ref: 'Department'
    },
    to: {
        type: ObjectId,
        ref: 'Department'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        default: null
    },
});

module.exports = mongoose.model('TeacherRequest', teacherRequestSchema);