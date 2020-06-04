const router = require('express').Router();

const Department = require('../models/Department');

const {
    getCourses,
    addCourse,
    updateCourse,
    deleteCourse
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
                    select: '_id name credit_hours'
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
router.post('/teacher', addTeacher);
router.delete('/teacher/:id', deleteTeacher);
router.patch('/teacher/:id', updateTeacher);

router.get('/rooms', getRooms);
router.post('/room', addRoom);
router.delete('/room/:id', deleteRoom);
router.patch('/room/:id', updateRoom);

router.get('/batches', getBatches);
router.post('/batch', addBatch);
router.delete('/batch/:id', deleteBatch);
router.patch('/batch/:id', updateBatch);

router.get('/courses', getCourses);
router.post('/course', addCourse);
router.delete('/course/:id', deleteCourse);
router.patch('/course/:id', updateCourse);

router.get('/teacher-to-courses', getTeacherToCourses);
router.post('/teacher-to-course', addTeacherToCourse);
router.delete('/teacher-to-course/:id', deleteTeacherToCourse);
router.patch('/teacher-to-course/:id', updateTeacherToCourse);

router.get('/received-requests', receivedRequests);
router.get('/sent-requests', sentRequests);
router.patch('/respond-to-request', respondToRequest);

module.exports = router;