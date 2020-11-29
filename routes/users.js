const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const auth = require('../middlewares/auth');
const error = require('../error');
const {
    ADMIN,
    DEAN,
    HEAD
} = require('../enums/roles');

router.get('/checkSessionToken', auth, async (req,res) => {
   res.status(200).json({success: true});
});

router.get('/', auth, async (req, res, next) => {
    try {
        const query = {}
        
        if (req.query.role) {
            query.role = req.query.role;
        }

        if (req.user && req.user.role && req.user.role !== ADMIN) {
            query.created_by = req.user._id;
        }

        const users = await User.find(query);
        res.status(200).json({users: _getUsersWithoutPassword(users)});
    } catch (e) {
        return next(error(400, e.message));
    }
});

router.get('/:id', auth, async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
            created_by: req.user._id
        });
        res.status(200).json({user: user});
    } catch (e) {
        return next(error(400, e.message));
    }
});

router.delete('/:id', auth, async (req, res, next) => {
    try {
        const response = await User.deleteOne({
            _id: req.params.id,
            created_by: req.user._id
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

router.patch('/:id', auth, async (req, res, next) => {
    try {
        const response = await User.updateOne({
            _id: req.params.id,
            created_by: req.user._id
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

router.patch('/change-password/:id', auth, async (req, res, next) => {
    try {
        const {
            oldPassword,
            newPassword
        } = req.body;
        const id = req.user._id;
        const user = await User.findOne({
            _id: id
        });
        if (!user) return next(400, error("User not Registered"));
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

router.post('/register', auth, async (req, res, next) => {
    try {
        const {
            username,
            email,
            password
        } = req.body;
        if (!username || !email || !password) return next(error(400, 'Incomplete form'));

        const userExisted = await User.findOne({
            email
        });
        if (userExisted) return next(error(400, "User already existed"));
        const role = req.user.role === ADMIN ? DEAN : HEAD;
        const newUser = await new User({
            username,
            email,
            password,
            created_by: req.user._id,
            role
        }).save();
        res.status(201).json(_getUserWithoutPassword(newUser));

    } catch (e) {
        return next(error(e.message));
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;
        if (!email || !password) return next(error("Form is not complete!"));

        const user = await User.findOne({
            email
        });
        if (!user) return next(error(400, "User is not registered"));
        if (!user.comparePassword(password)) return next(error(400, 'Invalid Password'));

        const token = await jwt.sign({
            _id: user._id,
            role: user.role
        }, process.env.SECRET);
        if (!token) return next(error('Error in generating token'));

        res.header('Authorization', token);
        res.status(200).json(_getUserWithoutPassword(user));
    } catch (e) {
        return next(error(400, e.message));
    }
});

const _getUserWithoutPassword = ({
    _id,
    username,
    email,
    role
}) => ({
    _id,
    username,
    email,
    role
});

const _getUsersWithoutPassword =
    (users) =>
    users.map(user => _getUserWithoutPassword(user));

module.exports = router;