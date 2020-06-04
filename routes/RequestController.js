const Department = require('../models/Department');
const TeacherToCourse = require('../models/TeacherToCourse');
const TeacherRequest = require('../models/TeacherRequest');

const error = require('../error');

const respondToRequest = async (req, res, next) => {
    try {
        const {
            responses
        } = req.body;
        responses.forEach(async (response, index) => {
            const {
                teacher,
                requestId
            } = response;
            await TeacherRequest.findOne({
                _id: requestId
            }, async (err, tr) => {
                const {
                    course,
                    from
                } = tr;
                const ttc = await TeacherToCourse({
                    teacher,
                    course,
                    department: from,
                    borrowed: true
                }).save();
                tr.teacher = teacher;
                tr.save();

                const referenceTeacherToCourse = await Department.updateOne({
                    _id: tr.from
                }, {
                    $push: {
                        teacher_to_courses: ttc._id
                    }
                });

                if (referenceTeacherToCourse.nModified <= 0) {
                    await TeacherToCourse.deleteOne({
                        _id: ttc._id
                    });
                    return next(error(500, "Unable to reference TeacherToCourse"));
                }
            });

            if (index === responses.length - 1) {
                res.status(201).json({
                    success: true
                });
            }
        });
    } catch (e) {
        return next(error(e.message));
    }
};

const receivedRequests = async (req, res, next) => {
    try {
        const department = await Department.findOne({
            head: req.user._id
        });
        const requests = await TeacherRequest.find({
            to: department._id
        });
        res.status(200).json(requests);
    } catch (e) {
        return next(error(e.message));
    }
};

const sentRequests = async (req, res, next) => {
    try {
        const department = await Department.findOne({
            head: req.user._id
        });
        const requests = await TeacherRequest.find({
            from: department._id
        });
        res.status(200).json(requests);
    } catch (e) {
        return next(error(e.message));
    }
};

module.exports = {
    respondToRequest,
    receivedRequests,
    sentRequests
};