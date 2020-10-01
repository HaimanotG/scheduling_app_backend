const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dean: {
        type: ObjectId,
        ref: 'User'
    },
    departments: [{
        type: ObjectId,
        ref: 'Department'
    }]
});

module.exports = mongoose.model('College', collegeSchema);