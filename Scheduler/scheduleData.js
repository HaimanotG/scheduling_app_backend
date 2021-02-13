const Department = require('../models/Department');
const fs = require('fs');
const getDepartmentByHead = async id => {
    try {
        const department = await Department.findOne({ head: id })
            .populate({
                path: "batches",
                populate: [{
                    path: "semesters",
                    populate: {
                        path: "courses",
                        populate: "teacher"
                    }
                },
                { path: "classRoom" },
                { path: "labRoom" }]
            })
            .populate("rooms")
            .exec()
        return department
    } catch (e) {
        return {}
    }
};

const timeSlots = () => {
    return ['Monday', 'Tuesday', 'Wedensday', 'Thursday', 'Friday'].map(day => ({
        day,
        hours: ['8:30AM', '9:30AM', '10:30AM', '11:30AM',
            '1:30PM', '2:30PM', '3:30PM', '4:30PM']
    }))
}

const getCurrentSemester = () => new Promise((resolve, reject) => {
    fs.readFile('currentSemester.txt', 'utf-8', (err, data) => {
        if (err) reject(err);
        resolve(data);
    });
})
module.exports = {
    timeSlots,
    getDepartmentByHead,
    getCurrentSemester
}