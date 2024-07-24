const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const bcrypt = require("bcrypt");
const User = require("../../models/userModel");
const Grade = require("../../models/gradeModel");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isLength({ min: 3 })
    .withMessage("Too short User name"),

  check("email")
    .notEmpty()
    .withMessage("User email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters"),

  check("role").optional(),

  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short user name"),

  // check("email")
  //   .optional()
  //   .isEmail()
  //   .withMessage("Invalid email address")
  //   .custom((val, { req }) =>
  //     User.findOne({ email: val }).then((user) => {
  //       if (user && user._id !== req.params.id) {
  //         return Promise.reject(new Error("E-mail already in user"));
  //       } else return true;
  //     })
  //   ),

  validatorMiddleware,
];

exports.changeLoggedUserPasswordValidation = [
  body("currentPassword").notEmpty().withMessage("enter current password"),
  body("passwordConfirm").notEmpty().withMessage("confirm a new password"),

  body("password")
    .notEmpty()
    .withMessage("enter a new password")
    .custom(async (password, { req }) => {
      const user = await User.findById(req.user._id);
      if (!user) throw new Error("no user for this id");
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword)
        throw new Error("no user found with this password");
      if (password !== req.body.passwordConfirm)
        throw new Error("password confirmation incorrect");
      return true;
    }),
  validatorMiddleware,
];

exports.changeUserPasswordValidation = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("password")
    .notEmpty()
    .withMessage("enter a new password")
    .custom(async (password, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) throw new Error("no user for this id");
      if (password !== req.body.passwordConfirm)
        throw new Error("password confirmation incorrect");
      return true;
    }),
  body("passwordConfirm").notEmpty().withMessage("confirm a new password"),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid User id format")
    .custom((val) =>
      Grade.findOne({ user: val }).then(async (grade) => {
        console.log(grade);

        if (grade) {
          const id = grade._id.toString();
          await Grade.findByIdAndDelete(id);
        }
        return true;
      })
    ),
  validatorMiddleware,
];
