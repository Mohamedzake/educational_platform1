const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("../utils/apiError");

const uploadImage = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images are allowed", 400));
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

const uploadFile = (dir) => {

  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${dir}`);
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.split(".")[1];
      const fileName = `${dir}-${uuidv4()}-${Date.now()}.${ext}`;
      req.body.file = fileName;
      req.body.name = file.originalname;
      cb(null, fileName);
    },
  });
  const upload = multer({ storage: multerStorage });

  return upload;
};

exports.uploadSingleImage = (field) => uploadImage().single(field);
exports.uploadSingleFile = (field, dir) => uploadFile(dir).single(field);
