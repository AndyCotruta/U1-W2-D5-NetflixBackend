import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

export const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data"
);

export const moviesJSONPath = join(dataFolderPath, "movies.json");

export const getMovies = () => readJSON(moviesJSONPath);
export const writeMovies = (moviesArray) =>
  writeJSON(moviesJSONPath, moviesArray);

export const publicFolderPath = join(process.cwd(), "./public");
export const moviesPostersPath = join(publicFolderPath, "moviesPosters");

export const saveMoviePoster = (fileName, posterAsBuffer) =>
  writeFile(join(moviesPostersPath, fileName), posterAsBuffer);
