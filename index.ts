import express from "express";
import { createServer } from "node:http";
import path from "node:path";
const socketio = require("socket.io");
const app = express();

const server = createServer(app);

const io = socketio(server);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket: any) => {
  socket.on("send-location", (data: any) => {
    io.emit("receive-location", data);
  });
  socket.on("disconnect", () => {
    io.emit("user-disconnected", { id: socket.id });
    console.log("A user disconnected" + socket.id);
  });
  console.log("A user connected");
});
app.get("/", (req, res) => {
  res.render("index");
});
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
