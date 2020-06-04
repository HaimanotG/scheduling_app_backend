const TeacherToCourse = require('../models/TeacherToCourse');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const Schedule = require('../models/Schedule');

const error = require('../error');

const schedule = async (req, res, next) => {
    try {
        const teacherToCourses = await TeacherToCourse.find();
        res.status(200).json(teacherToCourses);
    } catch (e) {
        return next(error(400, e.message));
    }
};

const getSchedule = async (req, res, next) => {
    Schedule.find()
        .populate('course')
        .populate('teacher')
        .exec()
        .then(schedule => res.json(200).json(schedule))
        .catch(e => next(error(400, e.message)));
};

module.exports = {
    schedule,
    getSchedule
};