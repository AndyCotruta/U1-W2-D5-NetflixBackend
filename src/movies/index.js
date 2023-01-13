import express from "express";
import { getMovies } from "../lib/fs-tools.js";

const moviesRouter = express.Router();

moviesRouter.get("/", async (req, res, next) => {
  try {
    const moviesArray = await getMovies();
    res.status(200).send(moviesArray);
  } catch (error) {
    next(error);
  }
});

export default moviesRouter;
