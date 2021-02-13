const Department = require('../models/Department');
const Batch = require('../models/Batch');
const Semester = require('../models/Semester');
const error = require('../error');

const getBatches = async (req, res, next) => {
    const department = await Department.findOne({ head: req.user._id });
    Batch.find({ department })
        .populate({
            path: 'labRoom',
            select: '_id name'
        })
        .populate({
            path: 'classRoom',
            select: '_id name'
        })
        .exec()
        .then((batches, error) => {
            if (error) throw error;
            res.status(200).json(batches);
        })
        .catch(e => {
            return next(error(e.message))
        });
};

const getBatch = async (req, res, next) => {
    const department = await Department.findOne({ head: req.user._id });
    Batch.findOne({ department, _id: req.params.id })
        .exec()
        .then((batch, error) => {
            if (error) throw error;
            res.status(200).json(batch);
        })
        .catch(e => {
            return next(error(e.message))
        });
}

const _createSemester = async (name, batch) => {
    const semester = await new Semester({
        name,
        batch
    }).save();
    return semester._id;
};

const _createSemesters = async batch => {
    let semesters = [];
    semesters.push(await _createSemester("First", batch));
    semesters.push(await _createSemester("Second", batch));
    return semesters;
};

const addBatch = async (req, res, next) => {
    try {
        const {
            name,
            classRoom,
            labRoom
        } = req.body;
        if (!name) return next(error(400, "Incomplete Form"));
        const department = await Department.findOne({
            head: req.user._id
        });
        if (!department) return next(error(400, "Unable to find Department!"));

        const isBatchRegisterd = await Batch.findOne({ name, department: department._id });
        if (isBatchRegisterd) {
            return next(error(400, 'Batch already registerd!'))
        }

        const batch = await new Batch({
            name,
            department: department._id,
            labRoom,
            classRoom
        }).save();

        const semesters = await _createSemesters(batch._id);
        const referenceSemester = await Batch.updateOne({
            _id: batch._id
        }, {
            $push: {
                semesters: semesters
            }
        });

        if (referenceSemester.nModified <= 0) {
            await Semester.deleteOne({
                _id: semesters[0]
            });
            await Semester.deleteOne({
                _id: semesters[1]
            });
            return next(error(500, "Unable to reference Semester"));
        }

        const referenceBatch = await Department.updateOne({
            head: req.user._id
        }, {
            $push: {
                batches: batch._id,
            }
        });
        if (referenceBatch.nModified <= 0) {
            await Batch.deleteOne({
                _id: batch._id
            });
            return next(error(500, "Unable to reference batch"));
        }
        res.status(201).json({
            batch
        })
    } catch (e) {
        return next(error(e.message))
    }
};

const deleteBatch = async (req, res, next) => {
    try {
        const response = await Batch.deleteOne({
            _id: req.params.id
        });
        if (response.deletedCount <= 0) {
            return next(error(400, "Unable to delete Batch"));
        }
        res.status(201).json({
            success: true
        })
    } catch (e) {
        return next(error(e.message))
    }
};

const updateBatch = async (req, res, next) => {
    try {
        const response = await Batch.updateOne({
            _id: req.params.id
        }, {
            $set: req.body
        });
        if (response.nModified <= 0) {
            return next(error(400, "Unable to Update Batch"));
        }
        res.status(201).json({
            success: true
        })
    } catch (e) {
        return next(error(e.message))
    }
};

const setClassRoomToBatch = async (req, res, next) => {
    try {
        const response = await Batch.updateOne({
            _id: req.params.id
        }, {
            $set: {
                classRoom: req.body
            }
        });

        if (response.nModified <= 0) {
            return next(error(400, "Unable to set Class Room to Batch"));
        }
        res.status(200).json({
            success: true
        })
    } catch (e) {
        return next(error(e.message));
    }
};

const setLabRoomToBatch = async (req, res, next) => {
    try {
        const response = await Batch.updateOne({
            _id: req.params.id
        }, {
            $set: {
                labRoom: req.body
            }
        });

        if (response.nModified <= 0) {
            return next(error(400, "Unable to set Lab Room to Batch"));
        }
        res.status(200).json({
            success: true
        })
    } catch (e) {
        return next(error(e.message));
    }
};

const setStudentGroupsToBatch = async (req, res, next) => {
    try {
        const response = await Batch.updateOne({
            _id: req.params.id
        }, {
            $set: {
                studentGroups: req.body
            }
        });

        if (response.nModified <= 0) {
            return next(error(400, "Unable to Update Batch"));
        }
        res.status(200).json({
            success: true
        })
    } catch (e) {
        return next(error(e.message));
    }
};

const getSemesters = async (req, res, next) => {
    try {
        const semesters = await Semester.find({ batch: req.params.batchId });
        res.status(200).json(semesters);
    } catch (e) {
        return next(error(e.message));
    }
}

module.exports = {
    getBatches,
    getBatch,
    addBatch,
    updateBatch,
    deleteBatch,
    setLabRoomToBatch,
    setClassRoomToBatch,
    setStudentGroupsToBatch,
    getSemesters
};