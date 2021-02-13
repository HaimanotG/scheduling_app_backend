const router = require("express").Router();
const Department = require("../models/Department");
const Schedule = require("../models/Schedule");
const error = require('../error');

router.get("/departments", async (req, res, next) => {
    Department.find()
        .populate({
            path: 'batches',
            select: '_id name'
        })
        .select('-rooms -teachers')
        .exec()
        .then(async (departments, error) => {
            if (error) throw error;
            res.status(200).json({ departments });
        })
        .catch(e => {
            return next(400, error(e.message));
        });
});

router.get("/teachers", async (req, res, next) => {
    Department.find()
        .populate({
            path: 'teachers',
            select: '_id name'
        })
        .select('-rooms -batches')
        .exec()
        .then(async (departments, error) => {
            if (error) throw error;
            res.status(200).json({ departments });
        })
        .catch(e => {
            return next(400, error(e.message));
        });
})

router.get("/departmentfromhead/:head", async (req, res, next) => {
    try {
        const { head } = req.params;
        const department = await Department.findOne({ head })
        res.status(200).json({ department })
    } catch (e) {
        return next(400, error(e.message));
    }
})

router.get("/:department/:batch", async (req, res, next) => {
    try {
        const { department, batch } = req.params;
        const schedule = await Schedule.find({ department, batch });
        res.status(200).json({ schedule });
    } catch (e) {
        return next(400, error(e.message));
    }
})

router.get("/teacher/:department/:teacher", async (req, res, next) => {
    try {
        const { department, teacher } = req.params;
        const schedule = await Schedule.find({ department, teacherId: teacher })
            .populate({ path: 'batch', select: 'name' });
        res.status(200).json({ schedule })
    } catch (e) {
        return next(400, error(e.message));
    }
})

router.get('/:scheduleId', async (req, res, next) => {
    try {
        const _id = req.params.scheduleId;
        const schedule = await Schedule.findOne({ _id });
        res.status(200).json({ schedule });
    } catch (e) {
        return next(error(e.message))
    }
})

router.patch('/:scheduleId', async (req, res, next) => {
    try {
        const response = await Schedule.updateOne({
            _id: req.params.scheduleId
        }, {
            $set: req.body
        });
        if (response.nModified <= 0) {
            return next(error(400, "Unable to Update Schedule"));
        }
        res.status(200).json({
            success: true
        })
    } catch (e) {
        return next(error(e.message))
    }
})

module.exports = router;