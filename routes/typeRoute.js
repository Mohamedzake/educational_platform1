const router = require("express").Router();

 const {createTypeValidator, getTypeValidator, updateMaterialValidator, deleteMaterialValidator}
  = require("../utils/validators/typeValidators");

const {
  getTypes,
  createType,
  getType,
  updateType,
  deleteType,
} = require("../controllers/typeController");
const {
  isAuthenticated,
  allowedTo,
} = require("../middlewares/AuthMiddlewares");

router.use(isAuthenticated);
router
  .route("/")
  .get(getTypes)
  .post(allowedTo("admin", "instructor"), createTypeValidator, createType);

router
  .route("/:id")
  .get(getTypeValidator, getType)
  .put(allowedTo("admin", "instructor"), updateMaterialValidator, updateType)
  .delete(allowedTo("admin", "instructor"), deleteMaterialValidator, deleteType);

module.exports = router;
