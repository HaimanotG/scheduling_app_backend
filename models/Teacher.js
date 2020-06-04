const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TeacherSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    department: {
        type: ObjectId,
        ref: 'Department'
    }
});

module.exports = mongoose.model('Teacher', TeacherSchema);