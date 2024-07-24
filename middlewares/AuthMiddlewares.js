const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");


const apiError = require("../utils/apiError");
const User = require("../models/userModel");



exports.isAuthenticated = asyncHandler(async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(
      new apiError("you are not login, please login to access this route", 401)
    );
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(
      new apiError("you are not login, please login to access this route", 401)
    );
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const currentUser = await User.findById(decoded.userId);

  if (!currentUser) {
    return next(
      new apiError("the user belonging to this token is no longer exist", 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler( async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new apiError("you are not allowed to access this route", 403)
      );
    }
    next();
  });
