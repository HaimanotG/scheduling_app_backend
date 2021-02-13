const Department = require('../models/Department');
const Batch = require('../models/Batch');
const Semester = require('../models/Semester');
const Teacher = require('../models/Teacher');
const Room = require('../models/Room');
const User = require('../models/User');
const Course = require('../models/Course');

const error = require('../error');
const getDepartments = async (req, res, next) => {
    Department.find()
        .populate({
            path: 'head',
            select: 'username'
        })
        .select("-batches -rooms -teachers")
        .exec()
        .then(async (departments, error) => {
            if (error) throw error;
            res.status(200).json(departments);
        })
        .catch(e => {
            return next(400, error(e.message));
        });
};

const getDepartment = async (req, res, next) => {
    Department.findOne({ _id: req.params.id })
        .exec()
        .then(async (department, error) => {
            if (error) throw error;
            res.status(200).json(department);
        })
        .catch(e => {
            return next(400, error(e.message));
        });
};

const _createBatch = async (name, department) => {
    const semesters = [];

    const batch = await new Batch({
        name,
        department
    }).save();

    semesters.push(await _createSemester("First", batch._id));
    semesters.push(await _createSemester("Second", batch._id));

    await Batch.updateOne({
        _id: batch._id
    }, {
        $push: {
            semesters
        }
    });
    return batch._id;
};

const _createSemester = async (name, batch) => {
    const semester = await new Semester({
        name,
        batch
    }).save();
    return semester._id;
};

const addDepartment = async (req, res, next) => {
    try {
        const {
            name,
            head
        } = req.body;
        const user = await User.findOne({
            _id: head,
        })
        if (!user) return next(error(400, 'Head is not registered!'));
        const isHeadOccupied = await Department.findOne({
            head
        });
        if (isHeadOccupied) return next(error(400, 'Head is already Occupied'));
        const isDepartmentRegisterd = await Department.findOne({ name });
        if (isDepartmentRegisterd) {
            return next(error(400, 'Department already registerd!'))
        }
        let batches = [];

        const department = await new Department({
            name,
            head
        }).save();
        const tbaTeacher = await new Teacher({ name: 'TBA', department: department._id }).save();
        batches.push(await _createBatch("First", department._id));
        batches.push(await _createBatch("Second", department._id));
        batches.push(await _createBatch("Third", department._id));

        await Department.updateOne({
            _id: department._id
        }, {
            $push: {
                batches: batches
            }
        });
        res.status(201).json({ success: true })
    } catch (e) {
        return next(error(e.message))
    }
};

const updateDepartment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const response = await Department.updateOne({
            _id: id
        }, {
            $set: req.body
        });
        if (response.nModified <= 0) {
            return next(error(400, "Unable to Update Department"));
        }
        res.status(201).json({
            success: true
        });
    } catch (e) {
        return next(error(e.message));
    }
};

const deleteDepartment = async (req, res, next) => {
    try {
        const department = req.params.id;
        await Teacher.deleteMany({
            department
        });
        await Room.deleteMany({
            department
        });
        await Batch.find({
            department
        }).then(async batches => {
            batches.forEach(async batch => {
                await Semester.find({
                    batch: batch._id
                }).then(async semesters => {
                    semesters.forEach(async semester => {
                        await Course.deleteMany({
                            semester: semester._id
                        });
                        semester.deleteOne();
                    });
                });
                batch.deleteOne();
            });
        });
        const response = await Department.deleteOne({
            _id: department
        });
        if (response.deletedCount <= 0) {
            return next(error("Unable to delete Department"));
        }
        res.status(200).json({
            success: true
        })
    } catch (e) {
        return next(error(e.message));
    }
};

module.exports = {
    getDepartments,
    getDepartment,
    addDepartment,
    deleteDepartment,
    updateDepartment
};