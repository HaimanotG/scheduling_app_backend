const Semester = require('../models/Semester');
const Course = require('../models/Course');
const TeacherRequest = require('../models/TeacherRequest');

const error = require('../error');
const getCourse = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const course = await Course.findOne({ _id });
        res.status(200).json(course);
    } catch (e) {
        return next(error(e.message))
    }
}

const getCourses = async (req, res, next) => {
    try {
        const semester = req.params.semester;
        const courses = await Course.find({ semester }).populate({ path: 'semester', select: 'name' }).exec()
        res.status(200).json(courses);
    } catch (e) {
        return next(error(e.message))
    }
};

const addCourse = async (req, res, next) => {
    try {
        const { name, semester, code, teacher, totalCreditHours, labCreditHours } = req.body;
        const isCourseSaved = await Course.findOne({ semester, name });
        if (isCourseSaved) {
            return next(error(400, 'Course already registered!'))
        }
        const course = await new Course({
            name, semester, code, teacher, totalCreditHours, labCreditHours
        }).save();
        const referenceCourse = await Semester.updateOne({ _id: semester }, {
            $push: {
                courses: course._id
            }
        });
        if (referenceCourse.nModified <= 0) {
            await Teacher.deleteOne({ _id: course._id });
            return next(error(400, 'Unable to reference Course'));
        }

        res.status(200).json({ success: true });
    } catch (e) {
        return next(error(e.message))
    }
};

const deleteCourse = async (req, res, next) => {
    try {
        const response = await Course.deleteOne({
            _id: req.params.id
        });
        if (response.deletedCount <= 0) {
            return next(error(400, "Unable to delete Course"));
        }
        res.status(201).json({
            success: true
        })
    } catch (e) {
        return next(error(e.message))
    }
};

const updateCourse = async (req, res, next) => {
    try {
        const response = await Course.updateOne({
            _id: req.params.id
        }, {
            $set: req.body
        });
        if (response.nModified <= 0) {
            return next(error(400, "Unable to Update Course"));
        }
        res.status(201).json({
            success: true
        })
    } catch (e) {
        return next(error(e.message))
    }
};

const assignTeacherToCourses = async (req, res, next) => {
    try {
        const department = await Department.findOne({
            head: req.user._id
        });

        const {
            teacherToCourses
        } = req.body;
        teacherToCourses.forEach(async (ttc, index) => {
            if (ttc.hasOwnProperty('to')) {
                const {
                    course,
                    to,
                    description
                } = ttc;
                if (!course || !to) return next(error(400, "Incomplete Form"));
                await TeacherRequest({
                    course,
                    from: department._id,
                    to,
                    description
                }).save();
            } else {
                const response = await Course.updateOne({
                    _id: ttc.course
                }, {
                    $set: {
                        teacher: ttc.teacher
                    }
                });

                if (response.n <= 0) {
                    return next(error(400, "Unable to assign teacher to course!"));
                }
            }

            if (index === teacherToCourses.length - 1) {
                res.status(200).json({
                    success: true
                });
            }
        });

    } catch (e) {
        return next(error(e.message))
    }
};

const removeTeacherFromCourse = async (req, res, next) => {
    try {
        const response = await Course.updateOne({
            _id: req.params.id
        }, {
            $set: {
                teacher: null
            }
        });
        if (response.nModified <= 0) {
            return next(error(400, "Unable to remove teacher from a Course"));
        }
        res.status(200).json({
            success: true
        })
    } catch (e) {
        return next(error(e.message))
    }
};

const changeTeacherForCourse = async (req, res, next) => {
    try {
        const response = await Course.updateOne({
            _id: req.params.id
        }, {
            $set: req.body
        });
        if (response.nModified <= 0) {
            return next(error(400, "Unable to change teacher for Course"));
        }
        res.status(200).json({
            success: true
        })
    } catch (e) {
        return next(error(e.message))
    }
};

module.exports = {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
    assignTeacherToCourses,
    removeTeacherFromCourse,
    changeTeacherForCourse
};