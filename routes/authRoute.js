const router = require('express').Router();

const {loginValidator} = require("../utils/validators/authValidators");
const authController = require('../controllers/authController');


router.post('/login', loginValidator, authController.login);

module.exports = router;