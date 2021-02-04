const catchAsync = require("../utils/catchAsync");

exports.protect = catchAsync(async (req, res, next) => {
  // getting token and check if it exists

  // validate token

  // check if user exist

  // checj if user changed password after the token was issued

  next();
});
