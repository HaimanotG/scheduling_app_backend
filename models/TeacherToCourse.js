const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const teacherToCourseSchema = new mongoose.Schema({
    teacher: {
        type: ObjectId,
        ref: 'Teacher'
    },
    course: {
        type: ObjectId,
        ref: 'Course'
    },
    department: {
        type: ObjectId,
        ref: 'Department'
    },
    borrowed: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model("TeacherToCourse", teacherToCourseSchema);