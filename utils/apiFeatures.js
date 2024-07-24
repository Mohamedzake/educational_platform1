class APIFeatures {
  constructor(mongooseQuery, query) {
    this.mongooseQuery = mongooseQuery;
    this.query = query;
  }

  filter() {
    const queryStringObj = { ...this.query };
    const excludedFields = ["page", "limit", "fields", "sort"];
    excludedFields.forEach((field) => delete queryStringObj[field]);
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|ne)\b/g,
      (match) => `$${match}`
    );
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  paginate(countDocuments) {
    const { page } = this.query;
    const { limit } = this.query;
    const skip = (page - 1) * limit;

    const endIndex = page * limit;
    const pagination = {};
    pagination.currentPage = page || 1;
    pagination.limit = limit || countDocuments;
    pagination.numberOfPages = Math.ceil(countDocuments / limit) || 1;
    if (endIndex < countDocuments) {
      pagination.next = +page + 1;
    }
    if (skip > 0) {
      pagination.prev = +page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResults = pagination;
    return this;
  }

  sort() {
    if (this.query.sort) {
      const sortBy = this.query.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.query.fields) {
      const fields = this.query.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName = "") {
    if (this.query.keyword) {
      const qr = {};
      if (modelName === "User") {
        qr.$or = [
          {
            name: { $regex: this.query.keyword, $options: "i" },
          },
        ];
      } else {
        qr.$or = [{ type: { $regex: this.query.keyword, $options: "i" } }];
      }
      this.mongooseQuery = this.mongooseQuery.find(qr);
    }

    return this;
  }
}

module.exports = APIFeatures;
