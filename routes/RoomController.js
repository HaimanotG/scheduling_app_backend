const Department = require('../models/Department');
const Room = require('../models/Room');
const error = require('../error');

const getRooms = async (req, res, next) => {
    Department.findOne({
            head: req.user._id
        })
        .populate({
            path: 'rooms',
            select: '_id name'
        })
        .exec().then((rooms, error) => {
            if (error) throw error;
            res.status(200).json(rooms);
        }).catch(e => {
            return next(error(e.message))
        });
};

const addRoom = async (req, res, next) => {
    try {
        const {
            name
        } = req.body;
        const department = await Department.findOne({
            head: req.user._id
        });
        if (!department) return next(error(400, "Unable to find Department!"));
        const room = await new Room({
            name,
            department: department._id,
        }).save();
        const referenceRoom = await Department.updateOne({
            head: req.user._id
        }, {
            $push: {
                rooms: room._id,
            }
        });

        if (referenceRoom.nModified <= 0) {
            await Room.deleteOne({
                _id: room._id
            });
            return next(error(500, "Unable to reference room"));
        }
        res.status(201).json({
            room
        });
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
    addRoom,
    deleteRoom,
    updateRoom
};