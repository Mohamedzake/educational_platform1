const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require('express-async-handler')

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

exports.login = asyncHandler(async (req, res, next) => {
  const password = req.body.password;

  const user = await User.findOne({ email: req.body.email });
  let isEqual;
  if (user) {
    isEqual = await bcrypt.compare(req.body.password, user.password);
  }

  if (!isEqual || !user) {
    return next(new ApiError("email or password is not correct", 400));
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    }
  );
  
  res.status(200).json({
    data: {
      user,
    },
    token: token,
  });
  
});

exports.isAuthenticated = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  let token;
  if (header && header.startsWith("Bearer")) token = header.split(" ")[1];

  if (!token) {
    return next(
      new ApiError("you are not login, please login to access this route", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const currentUser = await User.findById(decoded.userId);

  if (!currentUser) {
    return next(
      new ApiError("the user belonging to this token is no longer exist", 401)
    );
  }

  req.user = currentUser;
  next();
});

