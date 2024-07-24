const router = require("express").Router();

const {
  getQuestions,
  createQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");
const {
  isAuthenticated,
  allowedTo,
} = require("../middlewares/AuthMiddlewares");

router.use(isAuthenticated);
router
  .route("/")
  .get(getQuestions)
  .post(allowedTo("admin", "instructor"), createQuestion);

router
  .route("/:id")
  .get(allowedTo("admin", "instructor"), getQuestion)
  .put(allowedTo("admin", "instructor"), updateQuestion)
  .delete(allowedTo("admin", "instructor"), deleteQuestion);

module.exports = router;
