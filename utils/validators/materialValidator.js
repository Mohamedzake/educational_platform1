const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Course = require("../../models/courseModel");
const Material = require("../../models/materialModel");

exports.createMaterialValidator = [
  body("course")
    .isMongoId()
    .withMessage("Invalid material id format")
    .notEmpty()
    .withMessage("Please mention course id")
    .custom((val, { req }) =>
      Course.findById(val).then((course) => {
        if (!course)
          return Promise.reject(new Error("No course exist with this id"));

        if (
          req.user.role === "instructor" &&
          course.instructor !== req.user.name
        )
          return Promise.reject(
            new Error("you are not allowed to access this route")
          );
      })
    ),
  // check("file").notEmpty().withMessage("Please upload your file"),
  validatorMiddleware,
];

exports.getMaterialValidator = [
  check("id").isMongoId().withMessage("Invalid material id format"),

  validatorMiddleware,
];

exports.updateMaterialValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid material id format")
    .custom((val, { req }) =>
      Material.findById(val).then(async (material) => {
        const mId = material.course.toString();
        const course = await Course.findById(mId);
        if (
          req.user.role === "instructor" &&
          course.instructor !== req.user.name
        )
          return Promise.reject(
            new Error("you are not allowed to access this route")
          );
      })
    ),
  validatorMiddleware,
];

exports.deleteMaterialValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid material id format")
    .custom((val, { req }) =>
      Material.findById(val).then(async (material) => {
        const mId = material.course.toString();
        const course = await Course.findById(mId);
        if (
          req.user.role === "instructor" &&
          course.instructor !== req.user.name
        )
          return Promise.reject(
            new Error("you are not allowed to access this route")
          );
      })
    ),
  validatorMiddleware,
];
