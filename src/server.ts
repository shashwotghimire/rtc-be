import app from "./app";
import dotenv from "dotenv";
import http from "http";
import { initSocket } from "./websockets";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`server running on port : ${PORT}`);
});
