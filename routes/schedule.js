const Schedule = require("../models/Schedule");

const {
  startSchedule
} = require("../Scheduler");

const error = require("../error");

const schedule = async (req, res, next) => {
  startSchedule()
    .then(d => res.status(200).json(d))
    .catch(e => next(error(400, e.message)));
};

const getSchedule = async (req, res, next) => {
  Schedule.find()
    .populate("course")
    .populate("teacher")
    .exec()
    .then(schedule => res.json(200).json(schedule))
    .catch(e => next(error(400, e.message)));
};

module.exports = {
  schedule,
  getSchedule
};