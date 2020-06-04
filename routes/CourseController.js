const Department = require('../models/Department');
const Course = require('../models/Course');
const Semester = require('../models/Semester');

const error = require('../error');

const getCourses = async (req, res, next) => {
    Department.findOne({head: req.user._id})
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
        }).exec()
        .then((department, error) => {
            if (error) throw error;
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

const addCourse = async (req, res, next) => {
    try {
        const {name, credit_hours, semester} = req.body;
        if (!name || !credit_hours || !semester) return next(error(400, "Incomplete Form"));
        const course = await new Course({name, credit_hours, semester}).save();
        const referenceCourse = await Semester.updateOne({_id: semester}, {
            $push: {
                courses: course._id
            }
        });
        if (referenceCourse.nModified <= 0) {
            await Course.deleteOne({_id: course._id});
            return next(error(500, "Unable to reference Course"));
        }
        res.status(201).json(course);
    } catch (e) {
        return next(error(e.message))
    }
};

const deleteCourse = async (req, res, next) => {
    try {
        const response = await Course.deleteOne({_id: req.params.id});
        if (response.deletedCount <= 0) {
            return next(error("Unable to delete Course"));
        }
        res.status(204).json({success: true});
    } catch (e) {
        return next(error(e.message))
    }
};

const updateCourse = async (req, res, next) => {
    try {
        const response = await Course.updateOne({_id: req.params.id}, {$set: req.body});
        if (response.nModified <= 0) {
            return next(error(400, "Unable to Update Course"));
        }
        res.status(201).json({success: true})
    } catch (e) {
        return next(error(e.message))
    }
};

module.exports = {
    getCourses,
    addCourse,
    updateCourse,
    deleteCourse,
};