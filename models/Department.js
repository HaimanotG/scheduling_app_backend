const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    college: {
        type: ObjectId,
        ref: 'College',
        required: true
    },
    head: {
        type: ObjectId,
        ref: 'User'
    },
    teachers: [{
        type: ObjectId,
        ref: 'Teacher'
    }],
    rooms: [{
        type: ObjectId,
        ref: 'Room'
    }],
    workDays: {type: Number},
    batches: [{
        type: ObjectId,
        ref: 'Batch'
    }]
});

module.exports = mongoose.model('Department', departmentSchema);