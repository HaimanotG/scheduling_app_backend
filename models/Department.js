const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
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
    batches: [{
        type: ObjectId,
        ref: 'Batch'
    }]
});

module.exports = mongoose.model('Department', departmentSchema);