const router = require('express').Router();

const {
    getColleges, addCollege,
    updateCollege, deleteCollege
} = require('./CollegeController');

const {schedule, getSchedule} = require('./schedule');

router.get('/colleges', getColleges);
router.post('/colleges', addCollege);
router.patch('/colleges/:id', updateCollege);
router.delete('/colleges/:id', deleteCollege);
router.get('/start-schedule', schedule);
router.get('/schedule', getSchedule);

module.exports = router;