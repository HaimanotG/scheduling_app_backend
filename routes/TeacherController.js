const Department = require('../models/Department');
const Teacher = require('../models/Teacher');
const error = require('../error');

const getTeachers = async (req, res, next) => {
    Department.findOne({head: req.user._id})
        .populate({
            path: 'teachers',
            select: '_id name'
        })
        .exec()
        .then((teacher, error) => {
            if (error) throw error;
            res.status(200).json(teacher);
        })
        .catch(e => {
            return next(error(e.message))
        });
};

const addTeacher = async (req, res, next) => {
    try {
        const {name} = req.body;
        if (!name) return next(error(400, "Incomplete Form"));
        const department = await Department.findOne({head: req.user._id});
        if (!department) return next(error(400, "Unable to find Department!"));

        const teacher = await new Teacher({
            name, department: department._id,
        }).save();
        const referenceTeacher = await Department.updateOne({head: req.user._id}, {
            $push: {
                teachers: teacher._id,
            }
        });
        if (referenceTeacher.nModified <= 0) {
            await Teacher.deleteOne({_id: teacher._id});
            return next(error(400, 'Unable to reference Teacher'));
        }
        res.status(201).json({teacher})
    } catch (e) {
        return next(error(e.message))
    }
};
const deleteTeacher = async (req, res, next) => {
    try {
        const response = await Teacher.deleteOne({_id: req.params.id});
        if (response.deletedCount <= 0) {
            return next(error(400, "Unable to delete Teacher"));
        }
        res.status(201).json({success: true})
    } catch (e) {
        return next(error(e.message))
    }
};

const updateTeacher = async (req, res, next) => {
    try {
        const response = await Teacher.updateOne({_id: req.params.id}, {$set: req.body});
        if (response.nModified <= 0) {
            return next(error(400, "Unable to Update Teacher"));
        }
        res.status(201).json({success: true})
    } catch (e) {
        return next(error(e.message));
    }
};

module.exports = {
    getTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher
};