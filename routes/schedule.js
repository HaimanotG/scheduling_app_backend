const Schedule = require('../models/Schedule');
const Department = require('../models/Department');

const error = require('../error');

const schedule = async (req, res, next) => {
    Department.findOne({
            head: req.user._id
        }, '_id name')
        .populate({
            path: 'batches',
            select: '_id name',
            populate: {
                path: 'semesters',
                select: '_id name',
                populate: {
                    path: 'courses',
                    select: '_id name credit_hours teacher'
                }
            }
        })
        .exec()
        .then(department => {
            res.status(200).json(department);
        })
        .catch(e => next(error(400, e.message)));
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