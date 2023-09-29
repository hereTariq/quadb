const jwt = require('jsonwebtoken');
const catchAsyncError = require('./catchAsyncError');

const auth = catchAsyncError(async (req, res, next) => {
    const bearerToken = req.header('Authorization');
    if (!bearerToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = bearerToken.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user_id = decoded.user_id;
    console.log(req.user_id);
    next();
});

module.exports = auth;
