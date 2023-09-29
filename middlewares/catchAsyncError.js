function catchAsyncError(passedFunc) {
    return (req, res, next) => {
        Promise.resolve(passedFunc(req, res, next)).catch(next);
    };
}
module.exports = catchAsyncError;
