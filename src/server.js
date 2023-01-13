import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import moviesRouter from "./movies/index.js";

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());

server.use("/media", moviesRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server listening on port: ${port}`);
});
