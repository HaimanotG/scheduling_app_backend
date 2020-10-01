const Department = require('../models/Department');
const Course = require('../models/Course');
const Semester = require('../models/Semester');
const TeacherRequest = require('../models/TeacherRequest');

const error = require('../error');

const getCourses = async (req, res, next) => {
    Department.findOne({
            head: req.user._id
        })
        .populate({
            path: 'batches',
            select: '_id name',
            populate: {
                path: 'semesters',
                select: '_id name',
                populate: {
                    path: 'courses',
                }
            }
        }).exec()
        .then((department, error) => {
            if (error) throw error;
            if (!department) throw Error("Unable to find Details");
            let courses = [];
            department.batches.forEach(batch => {
                batch.semesters.forEach(semester => {
                    semester.courses.forEach(course => {
                        courses.push(course);
                    });
                });
            });
            res.status(200).json(courses);
        })
        .catch(e => {
            return next(error(e.message))
        });
};

const _createCourses = async courses => {
    let courseIds = [];
    for (let course of courses) {
        courseIds.push(await _createCourse(course));
    }
    return courseIds;
};

const _createCourse = async course => {
    const {semester} = course;
    const newCourse = await new Course({
        ...course
    }).save();
    const referenceCourse = await Semester.updateOne({
        _id: semester
    }, {
        $push: {
            courses: newCourse._id
        }
    });

    return newCourse._id;
};

const addCourse = async (req, res, next) =>  {
    try {
        const {courses} = req.body;
        const courseIds = await _createCourses(courses);
        res.status(200).json(courses);
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
            return next(error("Unable to delete Course"));
        }
        res.status(204).json({
            success: true
        });
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
        res.status(200).json({
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
            _id: req.params.courseId
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
            _id: req.params.courseId
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
    addCourse,
    updateCourse,
    deleteCourse,
    assignTeacherToCourses,
    removeTeacherFromCourse,
    changeTeacherForCourse
};