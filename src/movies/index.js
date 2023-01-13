import express from "express";
import { getMovies, saveMoviePoster, writeMovies } from "../lib/fs-tools.js";
import uniqid from "uniqid";
import { checksMovieSchema, triggerMovieBadRequest } from "./validator.js";
import multer from "multer";
import { extname, join } from "path";

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
    if (searchedMovie) {
      res.send(searchedMovie);
    } else {
      next(NotFound(`Movie with id ${movieId} not found`));
    }
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

moviesRouter.delete("/:movieId", async (req, res, next) => {
  try {
    const moviesArray = await getMovies();
    const movieId = req.params.movieId;
    const filteredMovieArray = moviesArray.filter((m) => m.imdbID !== movieId);
    if (filteredMovieArray.length !== moviesArray.length) {
      await writeMovies(filteredMovieArray);
      res.status(204).send(`Movie with id ${movieId} was removed successfully`);
    } else {
      next(NotFound(`Movie with id ${movieId} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

moviesRouter.post(
  "/:movieId/poster",
  multer().single("poster"),
  async (req, res, next) => {
    try {
      const fileExtensionType = extname(req.file.originalname);
      const fileName = req.params.movieId + fileExtensionType;
      await saveMoviePoster(fileName, req.file.buffer);
      const posterUrl = `http://localhost:3001/moviesPosters/${fileName}`;
      const moviesArray = await getMovies();
      const movieId = req.params.movieId;
      const oldMovieIndex = moviesArray.findIndex((m) => m.imdbID === movieId);
      if (oldMovieIndex !== -1) {
        const oldMovie = moviesArray[oldMovieIndex];
        const newMovie = {
          ...oldMovie,
          poster: posterUrl,
        };
        moviesArray[oldMovieIndex] = newMovie;
        await writeMovies(moviesArray);
        res.send("The new poster was saved successfully");
      } else {
        next(NotFound(`Movie with id ${movieId} was not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default moviesRouter;
