const departments = require('./departments');
const teachers = require('./teachers');
const batches = require('./batches');
const courses = require('./courses');
const rooms = require('./rooms');
const requests = require('./requests');
const schedule = require('../Scheduler');
const currentSemester = require('./currentSemester');
const generatedSchedule = require('./generatedSchedule');

module.exports = {
    departments,
    teachers,
    batches,
    courses,
    rooms,
    requests,
    schedule,
    currentSemester,
    generatedSchedule
};