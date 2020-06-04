const Department = require('../models/Department');
const TeacherToCourse = require('../models/TeacherToCourse');
const TeacherRequest = require('../models/TeacherRequest');

const error = require('../error');

const getTeacherToCourses = async (req, res, next) => {
    Department.findOne({
            head: req.user._id
        })
        .populate({
            path: 'teacher_to_courses',
            populate: {
                path: 'teacher',
                select: '_id name borrowed department'
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
            res.status(200).json(department.teacher_to_courses);
        })
        .catch(e => {
            return next(error(e.message))
        });
};

const deleteTeacherToCourse = async (req, res, next) => {
    try {
        const response = await TeacherToCourse.deleteOne({
            _id: req.params.id
        });
        if (response.deletedCount <= 0) {
            return next(error("Unable to delete TeacherToCourse"));
        }
        res.status(201).json({
            success: true
        });
    } catch (e) {
        return next(error(e.message))
    }
};

const updateTeacherToCourse = async (req, res, next) => {
    try {
        const response = await TeacherToCourse.updateOne({
            _id: req.params.id
        }, {
            $set: req.body
        });
        if (response.nModified <= 0) {
            return next(error(400, "Unable to Update TeacherToCourse"));
        }
        res.status(201).json({
            success: true
        })
    } catch (e) {
        return next(error(e.message))
    }
};

const addTeacherToCourse = async (req, res, next) => {
    try {
        const department = await Department.findOne({
            head: req.user._id
        });
        if (!department) return next(error(400, "Unable to find Department!"));
        let ttcIds = [];
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
                const {
                    teacher,
                    course
                } = ttc;
                if (!teacher || !course) return next(error(400, "Incomplete Form"));
                const teacherToCourse = await new TeacherToCourse({
                    teacher,
                    course,
                    department: department._id
                }).save();
                ttcIds.push(teacherToCourse._id);
            }

            if (index === teacherToCourses.length - 1) {

                const referenceTeacherToCourse = await Department.updateOne({
                    head: req.user._id
                }, {
                    $push: {
                        teacher_to_courses: ttcIds
                    }
                });

                if (referenceTeacherToCourse.nModified <= 0) {
                    ttcIds.forEach(async ttcId => {
                        await TeacherToCourse.deleteOne({
                            _id: ttcId
                        });
                    });
                    return next(error(500, "Unable to reference TeacherToCourse"));
                }

                res.status(200).json({
                    success: true
                });
            }
        });
    } catch (e) {
        return next(error(e.message))
    }
};

module.exports = {
    getTeacherToCourses,
    addTeacherToCourse,
    deleteTeacherToCourse,
    updateTeacherToCourse
};