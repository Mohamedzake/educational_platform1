const router = require("express").Router();

const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  changeUserPasswordValidation,
  changeLoggedUserPasswordValidation,
  deleteUserValidator,
} = require("../utils/validators/userValidators");
const {
  isAuthenticated,
  allowedTo,
} = require("../middlewares/AuthMiddlewares");

const {
  uploadUserImage,
  resizeImage,
  getUsers,
  createUser,
  getUser,
  updateUser,
  changeUserPassword,
  deleteUser,
  getLoggedUser,
  updateLoggedUser,
  changeLoggedUserPassword,
  deleteLoggedUser,
} = require("../controllers/userController");

// router.use(isAuthenticated, allowedTo("admin"));

router.use(isAuthenticated);
router
  .route("/me")
  .get(getLoggedUser, getUser)
  .put(uploadUserImage, resizeImage, updateLoggedUser, updateUser)
  .delete(deleteLoggedUser, deleteUser);

router
  .route("/changePassword/:id")
  .put(allowedTo("admin"), changeUserPasswordValidation, changeUserPassword);

router
  .route("/changeMyPassword")
  .put(
    changeLoggedUserPasswordValidation,
    changeLoggedUserPassword,
    changeUserPassword
  );

router.get("/", getUsers);
router.post(
  "/",
  allowedTo("admin"),
  uploadUserImage,
  resizeImage,
  createUserValidator,
  createUser
);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(
    allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(allowedTo("admin"), deleteUserValidator, deleteUser);

module.exports = router;
