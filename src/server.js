import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import moviesRouter from "./movies/index.js";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";
import { publicFolderPath } from "./lib/fs-tools.js";

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());
server.use(express.static(publicFolderPath));

server.use("/media", moviesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server listening on port: ${port}`);
});
