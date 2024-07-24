const asyncHandler = require("express-async-handler");

const ApiFeatures = require("../utils/apiFeatures");
const ApiError = require("../utils/apiError");
const { uploadSingleFile } = require("../middlewares/uploadfilesMiddlewares");
const Material = require("../models/materialModel");
const Type = require("../models/typeModel");

exports.uploadMaterialFile = uploadSingleFile("file", "materials");
const checkMaterialType = (type) => !type.includes("Task");

exports.createMaterial = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user" && checkMaterialType(req.body.type))
    return next(new ApiError("You are not allowed to access this route"));
  const type = await Type.findOne({
    type: req.body.type,
    course: req.body.course,
  });
  if (!type) return next(new ApiError("No title exist with this type", 404));

  const material = await Material.create(req.body);
  type.materials.push({
    file: material.file,
    id: material._id,
    name: req.body.name,
    user: req.user._id,
  });
  await type.save();

  res.status(200).json({
    status: "success",
    data: {
      material,
    },
  });
});

exports.getMaterials = asyncHandler(async (req, res, next) => {
  if (req.params.courseId) req.query.course = req.params.courseId;

  let filter = {};
  if (req.filterObj) filter = req.filterObj;
  const apiFeatures = new ApiFeatures(Material.find(filter), req.query);
  apiFeatures.filter().sort().limitFields().search();
  const { mongooseQuery } = apiFeatures;

  const materials = await mongooseQuery;

  res.status(200).json({
    results: materials.length,
    data: { materials },
  });
});

exports.getMaterial = asyncHandler(async (req, res, next) => {
  const material = await Material.findById(req.params.id);
  if (!material) {
    return next(new ApiError("No material exist with this id", 404));
  }
  if (req.user.role === "user" && checkMaterialType(material.type))
    return next(new ApiError("You are not allowed to access this route"));
  res.status(200).json({
    status: "success",
    data: {
      material,
    },
  });
});

exports.updateMaterial = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const material = await Material.findByIdAndUpdate(
    id,
    { file: req.body.file },
    {
      new: true,
    }
  );
  if (!material)
    return next(new ApiError("No material exist with this id", 404));

  if (req.user.role === "user" && checkMaterialType(material.type))
    return next(new ApiError("You are not allowed to access this route"));

  const type = await Type.findOne({
    type: material.type,
    course: material.course,
  });
  const newMaterials = [];
  type.materials.map((el) => {
    if (el.id === id) {
      newMaterials.push({
        file: material.file,
        id: material._id,
        user: req.user._id.toString(),
        name: req.body.name,
      });
    } else newMaterials.push(el);
  });
  type.materials = newMaterials;
  await type.save();

  return res.status(200).json({
    status: "success",
    data: {
      material,
    },
  });
});

exports.deleteMaterial = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const material = await Material.findByIdAndDelete(id);
  if (!material) {
    return next(new ApiError(`No material exist with this id: ${id}`, 404));
  }
  if (req.user.role === "user" && checkMaterialType(material.type))
    return next(new ApiError("You are not allowed to access this route"));
  const type = await Type.findOne({
    type: material.type,
    course: material.course,
  });

  const newMaterials = [];
  type.materials.forEach((el) => {
    if (el.id === id) {
    } else newMaterials.push(el);
  });
  type.materials = newMaterials;
  await type.save();
  res.status(204).json({
    status: "success",
  });
});
