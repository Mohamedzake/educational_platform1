const router = require("express").Router();

const materialRoute = require("./materialRoute");
const {
  createCourseValidator,
  getCourseValidator,
  updateCourseValidator,
  deleteCourseValidator,
} = require("../utils/validators/courseValidators");

const {
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  uploadCourseImage,
  resizeImage,
} = require("../controllers/courseController");
const { isAuthenticated, allowedTo } = require("../middlewares/AuthMiddlewares");

router.use("/:courseId/materials", materialRoute);
router.use(isAuthenticated);

router
  .route("/")
  .get(getCourses)
  .post(
    allowedTo("admin"),
    uploadCourseImage,
    resizeImage,
    createCourseValidator,
    createCourse
  );

router
  .route("/:id")
  .get(getCourseValidator, getCourse)
  .put(
    allowedTo("admin"),
    uploadCourseImage,
    resizeImage,
    updateCourseValidator,
    updateCourse
  )
  .delete(
    allowedTo("admin"),
    deleteCourseValidator,
    deleteCourse
  );

module.exports = router;
