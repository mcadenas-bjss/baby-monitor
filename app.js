const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const spawn = require("child_process").spawn;

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
  console.log("Client connected");

  let raspivid = spawn("raspivid", [
    "-o",
    "-",
    "-t",
    "0",
    "-w",
    "640",
    "-h",
    "480",
    "-fps",
    "30",
  ]);

  raspivid.stdout.on("data", function (data) {
    socket.emit("data", data);
  });

  socket.on("disconnect", function () {
    console.log("Client disconnected");
    raspivid.kill();
  });
});

server.listen(3000, function () {
  console.log("Listening on port 3000");
});
