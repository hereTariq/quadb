const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../middlewares/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const User = require('../models/user');

exports.signup = catchAsyncError(async (req, res, next) => {
    const { user_email, user_password } = req.body;
    if (!user_email || !user_password) {
        return next(
            new ErrorHandler('user_email and user_password are required')
        );
    }
    const user = await User.findOne({ where: { user_email } });
    if (user) {
        return next(new ErrorHandler('Account already exist', 400));
    }

    const hashedPass = await bcrypt.hash(user_password, 12);
    req.body.user_password = hashedPass;
    const newUser = await User.create(req.body);
    res.status(201).json({
        success: true,
        message: 'signup successful',
        user: newUser,
    });
});

exports.login = catchAsyncError(async (req, res, next) => {
    const { user_email, user_password } = req.body;
    if (!user_email || !user_password) {
        return next(
            new ErrorHandler('user_email and user_password are required')
        );
    }
    const user = await User.findOne({ where: { user_email } });
    if (!user) {
        return next(new ErrorHandler('Account does not exist', 400));
    }

    const validPass = await bcrypt.compare(user_password, user.user_password);
    if (!validPass) {
        return next(new ErrorHandler('Incorrect Credentials', 401));
    }

    user.last_logged_in = new Date();
    await user.save();

    const payload = { user_id: user.user_id };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '1d',
    });

    res.status(200).json({ success: true, message: 'Login successful', token });
});
