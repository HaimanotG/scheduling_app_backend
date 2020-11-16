const College = require('../models/College');
const User = require('../models/User');

const error = require('../error');

const getColleges = async (req, res, next) => {
    College.find()
        .populate({
            path: 'dean',
            select: '_id username email'
        })
        .populate({
            path: 'departments',
            select: 'id name',
            populate: {
                path: 'head',
                select: '_id name'
            }
        })
        .exec()
        .then(async (colleges, error) => {
            if (error) throw error;
            res.status(200).json({colleges});
        })
        .catch(e => {
            return next(400, error(e.message));
        });
};

const getCollege = async (req, res, next) => {
    try {
        const college = await College.findOne({
            _id: req.params.id,
        });
        res.status(200).json({college: college});
    } catch (e) {
        return next(error(400, e.message));
    }
}

const addCollege = async (req, res, next) => {
    try {
        const {name, dean} = req.body;
        const isDeanRegistered = await User.findOne({_id: dean, role: 'dean'});
        if (!isDeanRegistered) return next(error(400, 'Dean is not registered!'));
        const isDeanOccupied = await College.findOne({dean});
        if (isDeanOccupied) return next(error(400, 'Dean is already Occupied'));

        await new College({name, dean}).save();
        res.status(201).json({success: true});
    } catch (e) {
        return next(error(e.message));
    }
};

const updateCollege = async (req, res, next) => {
    try {
        const id = req.params.id;
        const response = await College.updateOne({_id: id}, {$set: req.body});
        if (response.nModified <= 0) {
            return next(error(400, "Unable to Update College"));
        }
        res.status(201).json({success: true});
    } catch (e) {
        return next(error(e.message));
    }
};

const deleteCollege = async (req, res, next) => {
    try {
        const id = req.params.id;
        const response = await College.deleteOne({_id: id});
        if (response.deletedCount <= 0) {
            return next(error(400, 'Unable to delete College!'));
        }
        res.status(201).json({success: true});
    } catch (e) {
        return next(error(e.message));
    }
};

module.exports = {
    getColleges,
    getCollege,
    addCollege,
    deleteCollege,
    updateCollege
};