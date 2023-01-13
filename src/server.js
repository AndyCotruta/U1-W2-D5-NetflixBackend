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
import createHttpError from "http-errors";

const server = express();
const port = process.env.PORT;

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOptions = {
  origin: (origin, corsNext) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist`)
      );
    }
  },
};

server.use(cors(corsOptions));
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
