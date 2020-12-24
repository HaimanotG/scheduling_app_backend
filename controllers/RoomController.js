const Department = require('../models/Department');
const Room = require('../models/Room');
const error = require('../error');

const getRooms = async (req, res, next) => {
    const department = await Department.findOne({ head: req.user._id });
    Room.find({ department })
        .exec().then((rooms, error) => {
            if (error) throw error;
            res.status(200).json(rooms);
        }).catch(e => {
            return next(error(e.message))
        });
};

const getRoom = async (req, res, next) => {
    const department = await Department.findOne({ head: req.user._id });
    Room.findOne({ department, _id: req.params.id })
        .exec().then((room, error) => {
            if (error) throw error;
            res.status(200).json(room);
        }).catch(e => {
            return next(error(e.message))
        });
};

const addRoom = async (req, res, next) => {
    try {
        const { name, isLab } = req.body;

        const department = await Department.findOne({ head: req.user._id });
        if (!department) return next(error(400, "Unable to find Department!"));

        await new Room({
            name,
            isLab,
            department: department._id
        }).save();
        
        res.status(201).json({ success: true });
    } catch (e) {
        return next(error(e.message))
    }
};

const updateRoom = async (req, res, next) => {
    try {
        const response = await Room.updateOne({
            _id: req.params.id
        }, {
            $set: req.body
        });
        if (response.nModified <= 0) {
            return next(error(400, "Unable to Update Room"));
        }
        res.status(201).json({
            success: true
        })
    } catch (e) {
        return next(error(e.message))
    }
};

const deleteRoom = async (req, res, next) => {
    try {
        const response = await Room.deleteOne({
            _id: req.params.id
        });
        if (response.deletedCount <= 0) {
            return next(error(400, "Unable to delete "));
        }
        res.status(201).json({
            success: true
        })
    } catch (e) {
        return next(error(e.message))
    }
};

module.exports = {
    getRooms,
    getRoom,
    addRoom,
    deleteRoom,
    updateRoom
};