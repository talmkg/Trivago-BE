import { checkSchema, validationResult } from "express-validator";

const schema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "title validation failed , type must be string  ",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage: "description validation failed , type must be string  ",
    },
  },
  location: {
    in: ["body"],
    isString: {
      errorMessage: "location validation failed , type must be string  ",
    },
  },
  maxGuests: {
    in: ["body"],
    isNumber: {
      errorMessage: "maxGuests validation failed , type must be a num  ",
    },
  },
  user: {
    in: ["body"],
    isMongoId: {
      errorMessage: "user must be a valid mongodb id",
    },
  },
};

const searchSchema = {
  title: {
    in: ["query"],
    isString: {
      errorMessage:
        "title must be in query and type must be  string to search!",
    },
  },
};

const commentSchema = {
  text: {
    isString: {
      errorMessage: "Text field is required for comment",
    },
  },
  "user.name": {
    isString: {
      errorMessage: "User name is required for comment",
    },
  },
  "user.avatar": {
    isString: {
      errorMessage: "User avatar is required for comment",
    },
  },
};

export const checkCommentSchema = checkSchema(commentSchema);

export const checkSearchSchema = checkSchema(searchSchema);

export const checkAccomodationSchema = checkSchema(schema);

export const checkValidationResult = (req, res, next) => {
  req.body.user = req.user._id.toString();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Accomodation validation is failed");
    error.status = 400;
    error.errors = errors.array();
    next(error);
  }
  next();
};
