const router = require("express").Router();

const {
  createScheduleValidator,
  getScheduleValidator,
  updateScheduleValidator,
  deletescheduleValidator,
} = require("../utils/validators/scheduleValidator");

const {
  getSchedules,
  createSchedule,
  getSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");
const {
  isAuthenticated,
  allowedTo,
} = require("../middlewares/AuthMiddlewares");

router.use(isAuthenticated);
router
  .route("/")
  .get(getSchedules)
  .post(allowedTo("admin", "instructor"), createScheduleValidator, createSchedule);

router
  .route("/:id")
  .get(allowedTo("admin", "instructor"), getSchedule)
  .put(allowedTo("admin", "instructor"), updateSchedule)
  .delete(allowedTo("admin", "instructor"), deleteSchedule);

module.exports = router;
