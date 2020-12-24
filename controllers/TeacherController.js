const Department = require('../models/Department');
const Teacher = require('../models/Teacher');
const error = require('../error');

const getTeachers = async (req, res, next) => {
    const department = await Department.findOne({ head: req.user._id });
    Teacher.find({ department })
        .exec()
        .then((teachers, error) => {
            if (error) throw error;
            res.status(200).json(teachers);
        })
        .catch(e => {
            return next(error(e.message))
        });
};

const getTeacher = async (req, res, next) => {
    const department = await Department.findOne({ head: req.user._id });
    Teacher.findOne({ department, _id: req.params.id })
        .exec()
        .then((teacher, error) => {
            if (error) throw error;
            res.status(200).json(teacher);
        })
        .catch(e => {
            return next(error(e.message))
        });
}

const _createTeachers = async (teachers, department) => {
    let teachersId = [];
    for (let teacher of teachers) {
        teachersId.push(await _createTeacher(teacher.name, department));
    }
    return teachersId;
};

const _createTeacher = async (name, department) => {
    const teacher = await new Teacher({
        name,
        department
    }).save();
    return teacher._id;
};

const addTeacher = async (req, res, next) => {
    try {
        const { name } = req.body;

        const department = await Department.findOne({ head: req.user._id });
        if (!department) return next(error(400, "Unable to find Department!"));
        await _createTeacher(name, department._id);
        // const teachersId = await _createTeachers(teachers, department._id);
        // const referenceTeacher = await Department.updateOne({ head: req.user._id }, {
        //     $push: {
        //         teachers: teachersId
        //     }
        // });
        // if (referenceTeacher.nModified <= 0) {
        //     for (let teacher of teachersId) {
        //         await Teacher.deleteOne({ _id: teacher._id });
        //     }
        //     return next(error(400, 'Unable to reference Teacher'));
        // }
        res.status(201).json({ success: true })
    } catch (e) {
        return next(error(e.message))
    }

};
const deleteTeacher = async (req, res, next) => {
    try {
        const response = await Teacher.deleteOne({ _id: req.params.id });
        if (response.deletedCount <= 0) {
            return next(error(400, "Unable to delete Teacher"));
        }
        res.status(201).json({ success: true })
    } catch (e) {
        return next(error(e.message))
    }
};

const updateTeacher = async (req, res, next) => {
    try {
        const response = await Teacher.updateOne({ _id: req.params.id }, { $set: req.body });
        if (response.nModified <= 0) {
            return next(error(400, "Unable to Update Teacher"));
        }
        res.status(201).json({ success: true })
    } catch (e) {
        return next(error(e.message));
    }
};

module.exports = {
    getTeachers,
    getTeacher,
    addTeacher,
    updateTeacher,
    deleteTeacher
};