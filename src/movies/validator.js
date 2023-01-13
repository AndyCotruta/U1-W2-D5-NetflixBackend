import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const movieSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is mandatory and must be a string",
    },
  },
  year: {
    in: ["body"],
    isInt: {
      errorMessage: "Year is mandatory and must be a number",
    },
  },
  type: {
    in: ["body"],
    isString: {
      errorMessage: "Type is mandatory and must be a string",
    },
  },
  poster: {
    in: ["body"],
    isString: {
      errorMessage: "Poster is mandatory and must be a string",
    },
  },
};

export const checksMovieSchema = checkSchema(movieSchema);
export const triggerMovieBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during movie validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
