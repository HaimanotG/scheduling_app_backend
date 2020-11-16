const Department = require('../models/Department');
const Room = require('../models/Room');
const error = require('../error');

const getRooms = async (req, res, next) => {
    const department = await Department.findOne({head: req.user._id});
    Room.find({department})
        .exec().then((rooms, error) => {
            if (error) throw error;
            res.status(200).json(rooms);
        }).catch(e => {
            return next(error(e.message))
        });
};

const _createRooms = async (rooms, department) => {
    const roomIds = [];
    for (let room of rooms) {
        roomIds.push(await _createRoom(room,department))
    }
    return roomIds;
};

const _createRoom = async ({name,isLab}, department) => {
    const room = await new Room({
        name,
        isLab,
        department
    }).save();
    return room._id;
};

const addRoom = async (req, res, next) => {
    try {
        const {rooms} = req.body;

        const department = await Department.findOne({ head: req.user._id });
        if (!department) return next(error(400, "Unable to find Department!"));

        const roomIds = await _createRooms(rooms,department._id);
        console.log(roomIds);
        const referenceRoom = await Department.updateOne({head: req.user._id}, {
            $push: {
                rooms: roomIds,
            }
        });

        if (referenceRoom.nModified <= 0) {
            for (let roomId of roomIds) {
                await Room.deleteOne({
                    _id: roomId
                });
            }
            return next(error(500, "Unable to reference room"));
        }
        res.status(201).json({
            rooms
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