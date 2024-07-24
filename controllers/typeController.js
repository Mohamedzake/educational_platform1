const asyncHandler = require("express-async-handler");
const Type = require("../models/typeModel");
const Material = require("../models/materialModel");

const ApiFeatures = require("../utils/apiFeatures");
const ApiError = require("../utils/apiError");

exports.getTypes = asyncHandler(async (req, res, next) => {
  // <<<<<<< HEAD
  // <<<<<<< HEAD
  const qr = req.query.type;
  let filter = {};
  if (qr && qr.ne && qr.ne === "Task") {
    filter = { type: { $not: /^task/i } };
  }
  // =======
  //     const qr = req.query.type;
  //     let filter = {};
  //     if(qr && qr.ne){
  //       filter = {type:{$not:/^task/i}};
  //     }
  // >>>>>>> 28634703058d300ebf9f108ab6ce0e1ddea66be9
  // =======
  //   const qr = req.query.type;
  //   let filter = {};
  //   if (qr && qr.ne) {
  //     filter = { type: { $not: /^task/i } };
  //   }
  // >>>>>>> fad6e82887c5ea456e4c2f68ee295ffea887269e
  const apiFeatures = new ApiFeatures(Type.find(filter), req.query);
  apiFeatures.filter().sort().limitFields().search("Type");
  const { mongooseQuery } = apiFeatures;
  const types = await mongooseQuery;
  types.reverse();
  // <<<<<<< HEAD
  // <<<<<<< HEAD
  // <<<<<<< HEAD

  //   if (req.user.role === "user" && qr && !qr.ne & qr.includes("Task")) {
  //     console.log(qr);
  // =======
  //   console.log(req.query);
  //   if (
  //     req.user.role === "user" &&
  //     req.query.keyword & req.query.keyword.includes("Task")
  //   ) {
  //     // >>>>>>> fad6e82887c5ea456e4c2f68ee295ffea887269e
  //     const x = [];
  //     types[0].materials.forEach((material) => {
  //       if (material.user === req.user._id.toString()) {
  //         x.push(material);
  //         return;
  //       }
  //     });
  //     types[0].materials = x;
  // =======

  if (req.query.keyword) {
    if (req.user.role === "user" && req.query.keyword.includes("Task")) {
      for (i = 0; i < types.length; i++) {
        const x = [];
        types[i].materials.forEach((material) => {
          if (material.user === req.user._id.toString()) {
            x.push(material);
            return;
          }
        });
        types[i].materials = x;
      }
    }
  }

  // if (req.user.role === "user" && qr && qr.includes("Task")) {
  //   const x = [];
  //   types[0].materials.forEach((material) => {
  //     if (material.user === req.user._id.toString()) {
  //       x.push(material);
  //       return;
  //     }
  //   });
  //   types[0].materials = x;
  // }

  // >>>>>>> c633051360a586c6399c688a1a00126af803da47
  res.status(200).json({
    results: types.length,
    data: { types },
  });
});

exports.createType = asyncHandler(async (req, res, next) => {
  req.body.type =
    req.body.type.charAt(0).toUpperCase() + req.body.type.slice(1);
  const check = await Type.findOne(req.body);
  if (check) return next(new ApiError(`This title already exist`, 404));

  const type = await Type.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      type,
    },
  });
});

exports.getType = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const type = await Type.findById(id);

  if (!type) {
    return next(new ApiError(`No title exist with this id: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      type,
    },
  });
});

exports.updateType = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const type = await Type.findByIdAndUpdate(id, req.body, { new: true });
  if (!type) {
    return next(new ApiError(`No title exist with this id: ${id}`, 404));
  }
  const target = type.type;
  type.materials.forEach(async function (el) {
    const material = await Material.findByIdAndUpdate(
      el.id,
      { type: target },
      { new: true }
    );
  });

  return res.status(200).json({
    status: "success",
    data: {
      type,
    },
  });
});

exports.deleteType = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const type = await Type.findByIdAndDelete(id);
  if (!type) {
    return next(new ApiError(`No title exist with this id: ${id}`, 404));
  }

  type.materials.forEach(async function (el) {
    const material = await Material.findByIdAndDelete(el.id);
  });
  res.status(204).json({
    status: "success",
  });
});
