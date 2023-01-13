import express from "express";
import { getMovies, writeMovies } from "../lib/fs-tools.js";
import uniqid from "uniqid";
import { checksMovieSchema, triggerMovieBadRequest } from "./validator.js";

const moviesRouter = express.Router();

moviesRouter.get("/", async (req, res, next) => {
  try {
    const moviesArray = await getMovies();
    res.status(200).send(moviesArray);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

moviesRouter.get("/:movieId", async (req, res, next) => {
  try {
    const movieId = req.params.movieId;
    const moviesArray = await getMovies();
    const searchedMovie = moviesArray.find((m) => m.imdbID === movieId);
    res.send(searchedMovie);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

moviesRouter.post(
  "/",
  checksMovieSchema,
  triggerMovieBadRequest,
  async (req, res, next) => {
    try {
      const moviesArray = await getMovies();
      const newMovie = { ...req.body, imdbID: uniqid() };
      moviesArray.push(newMovie);
      await writeMovies(moviesArray);
      res
        .status(201)
        .send(`Movie with id ${newMovie.imdbID} was added successfully`);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default moviesRouter;
