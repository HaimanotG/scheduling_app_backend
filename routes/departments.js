const router = require('express').Router();

const Department = require('../models/Department');

const {
    getCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    assignTeacherToCourses,
    removeTeacherFromCourse,
    changeTeacherForCourse
} = require('./CourseController');

const {
    getTeachers,
    addTeacher,
    deleteTeacher,
    updateTeacher
} = require('./TeacherController');

const {
    getRooms,
    addRoom,
    updateRoom,
    deleteRoom
} = require('./RoomController');

const {
    getBatches,
    addBatch,
    updateBatch,
    deleteBatch
} = require('./BatchController');

const {
    getTeacherToCourses,
    addTeacherToCourse,
    deleteTeacherToCourse,
    updateTeacherToCourse
} = require('./TeacherToCourseController');

const {
    respondToRequest,
    receivedRequests,
    sentRequests
} = require('./RequestController');

const {
    schedule,
    getSchedule
} = require('./schedule');

const error = require('../error');

router.get('/', async (req, res, next) => {
    Department.findOne({
            head: req.user._id
        })
        .populate({
            path: 'teachers',
            select: '_id name'
        })
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
        .populate({
            path: 'rooms',
            select: '_id name'
        })
        .populate({
            path: 'teacher_to_courses',
            populate: {
                path: 'teacher',
                select: '_id name'
            }
        })
        .populate({
            path: 'teacher_to_courses',
            populate: {
                path: 'course',
                select: '_id name credit_hours'
            }
        })
        .exec()
        .then((department, error) => {
            if (error) throw error;
            res.status(200).json(department);
        })
        .catch(e => {
            return next(error(e.message))
        });
});

router.get('/teachers', getTeachers);
router.post('/teachers', addTeacher);
router.delete('/teachers/:id', deleteTeacher);
router.patch('/teachers/:id', updateTeacher);

router.get('/rooms', getRooms);
router.post('/rooms', addRoom);
router.delete('/rooms/:id', deleteRoom);
router.patch('/rooms/:id', updateRoom);

router.get('/batches', getBatches);
router.post('/batches', addBatch);
router.delete('/batches/:id', deleteBatch);
router.patch('/batches/:id', updateBatch);

router.get('/courses', getCourses);
router.post('/courses', addCourse);
router.delete('/courses/:id', deleteCourse);
router.patch('/courses/:id', updateCourse);

router.post('/courses/assign-teachers', assignTeacherToCourses);
router.patch('/courses/:courseId/change-teacher', changeTeacherForCourse);
router.delete('/courses/:courseId/remove-teacher', removeTeacherFromCourse);

router.get('/received-requests', receivedRequests);
router.get('/sent-requests', sentRequests);
router.patch('/respond-to-request', respondToRequest);

router.get('/start-schedule', schedule);
router.get('/schedule', getSchedule);

module.exports = router;