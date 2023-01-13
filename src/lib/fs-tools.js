import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON } = fs;

export const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data"
);

export const moviesJSONPath = join(dataFolderPath, "movies.json");

export const getMovies = () => readJSON(moviesJSONPath);
export const writeMovies = (moviesArray) =>
  writeJSON(moviesJSONPath, moviesArray);
