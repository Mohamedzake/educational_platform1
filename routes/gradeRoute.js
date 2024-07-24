const router = require("express").Router();

const {
  getGrades,
  createGrade,
  getGrade,
  updateGrade,
  deleteGrade,
} = require("../controllers/gradeController");

const {
  createGradeValidator,
  getGradeValidator,
  updateGradeValidator,
  deleteGradeValidator,
} = require("../utils/validators/gradeValidator");

const {
  isAuthenticated,
  allowedTo,
} = require("../middlewares/AuthMiddlewares");

router.use(isAuthenticated);
router
  .route("/")
  .get(getGrades)
  .post(createGradeValidator, createGrade);

router
  .route("/:id")
  .get(getGrade)
  .put(allowedTo("admin", "instructor"), updateGrade)
  .delete(allowedTo("admin", "instructor"), deleteGrade);

module.exports = router;
