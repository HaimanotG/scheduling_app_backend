const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const auth = require('../middlewares/auth');
const permit = require('../middlewares/permit');
const error = require('../error');
const {
    ADMIN
} = require('../enums/roles');

router.get('/checkSessionToken', auth, async (req, res) => {
    res.status(200).json({ success: true });
});

router.get('/', auth, permit(ADMIN), async (req, res, next) => {
    try {
        const query = {}
        
        if (req.query.role) {
            query.role = req.query.role;
        }
        const users = await User.find(query).select('-password');
        res.status(200).json(users);
    } catch (e) {
        return next(error(400, e.message));
    }
});

router.get('/:id', auth, async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.params.id
        }).select('-password');
        res.status(200).json(user);
    } catch (e) {
        return next(error(400, e.message));
    }
});

router.delete('/:id', auth, permit(ADMIN), async (req, res, next) => {
    try {
        const response = await User.deleteOne({
            _id: req.params.id
        });
        if (response.deletedCount <= 0) {
            return next(error(400, 'Unable to delete User!'));
        }
        res.status(200).json({
            success: true
        });
    } catch (e) {
        return next(error(400, e.message));
    }
});

router.patch('/change-password', auth, async (req, res, next) => {
    try {
        const id = req.user._id;
        const {
            oldPassword,
            newPassword
        } = req.body;
        const user = await User.findOne({
            _id: id
        });
        if (!user) return next(error(400, "User not Registered"));
        if (!user.comparePassword(oldPassword)) return next(error(400, 'Invalid Password'));
        const response = await User.updateOne({
            _id: id
        }, {
            $set: {
                password: await user.hashPassword(newPassword)
            }
        });
        if (response.nModified <= 0) {
            return next(error(400, "Unable to change password"));
        }
        res.status(200).json({
            success: true
        });
    } catch (e) {
        return next(error(e.message));
    }
});

router.patch('/:id', auth, async (req, res, next) => {
    try {
        const response = await User.updateOne({
            _id: req.params.id
        }, {
            $set: req.body
        });
        if (response.nModified <= 0) {
            return next(error(400, "Unable to Update User!"));
        }
        res.status(200).json({
            success: true
        });
    } catch (e) {
        return next(error(400, e.message));
    }
});

router.post('/register', auth, permit(ADMIN), async (req, res, next) => {
    try {
        const {
            username,
            password
        } = req.body;
        if (!username || !password) return next(error(400, 'Incomplete form'));

        const userExisted = await User.findOne({
            username
        });
        if (userExisted) return next(error(400, "User already Registered"));

        const newUser = await new User({
            username,
            password,
            role: 'head'
        }).save();
        res.status(201).json(_getUserWithoutPassword(newUser));

    } catch (e) {
        return next(error(e.message));
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const {
            username,
            password
        } = req.body;
        if (!username || !password) return next(error("Form is not complete!"));

        const user = await User.findOne({
            username
        });

        if (!user) return next(error(400, "User is not registered"));
        if (!user.comparePassword(password)) return next(error(400, 'Invalid Password'));

        const token = await jwt.sign({
            _id: user._id,
            role: user.role
        }, process.env.SECRET);
        
        if (!token) return next(error('Error in generating token'));

        res.header('x-auth-token', token);
        res.status(200).json(_getUserWithoutPassword(user));
    } catch (e) {
        return next(error(400, e.message));
    }
});

const _getUserWithoutPassword = ({
    _id,
    username,
    email,
    role,
    fullName,
}) => ({
    _id,
    username,
    email,
    role,
    fullName
});

module.exports = router;