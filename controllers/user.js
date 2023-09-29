const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../middlewares/errorHandler');
const User = require('../models/user');

exports.insert = catchAsyncError(async (req, res, next) => {
    if (req.body.user_password) {
        const hashedPass = await bcrypt.hash(req.body.user_password, 12);
        req.body.user_password = hashedPass;
    }
    const newUser = await User.create(req.body);
    let { user_password, ...rest } = newUser.dataValues;
    res.status(201).json({
        success: true,
        message: 'user created successfully',
        user: rest,
    });
});

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.findAll({
        attributes: { exclude: ['user_password'] },
    });
    if (users.length == 0) {
        return next(new ErrorHandler('No user exist', 404));
    }
    res.status(200).json({
        message: 'users fetched successfully',
        success: true,
        users,
    });
});

exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const { user_id } = req.params;
    const user = await User.destroy({ where: { user_id } });
    if (!user) {
        return next(new ErrorHandler('User does not exist', 404));
    }

    res.status(200).json({
        success: true,
        message: 'user deleted successfully',
    });
});

exports.getDetails = catchAsyncError(async (req, res, next) => {
    const { user_id } = req.params;
    const user = await User.findByPk(user_id, {
        attributes: { exclude: ['user_password'] },
    });
    if (!user) {
        return next(new ErrorHandler('User does not exist', 404));
    }

    res.status(200).json({
        message: 'user fetched successfully',
        success: true,
        user,
    });
});

exports.getImage = catchAsyncError(async (req, res, next) => {
    const { user_id } = req.params;
    const user = await User.findByPk(user_id);
    if (!user) {
        return next(new ErrorHandler('User does not exist', 404));
    }

    if (!user.user_image) {
        return next(new ErrorHandler('user has no image', 404));
    }

    res.status(200).json({
        message: 'image fetching successful',
        success: true,
        user_image: user.user_image,
    });
});

exports.update = catchAsyncError(async (req, res, next) => {
    const { user_id } = req.params;
    const user = await User.findByPk(user_id, {
        attributes: { exclude: ['user_password'] },
    });
    if (!user) {
        return next(new ErrorHandler('User does not exist', 404));
    }

    if (req.body.user_password) {
        let hashedPass = await bcrypt.hash(req.body.user_password, 12);
        req.body.user_password = hashedPass;
    }
    await user.update(req.body);
    res.status(200).json({
        message: 'User details updated successfully',
        success: true,
        user,
    });
});
