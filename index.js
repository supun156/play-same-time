const express = require("express");
const app = express();

var server = require("http").Server(app);
var io = require("socket.io")(server);

const port = 5000;
app.use(express.static("public"));
app.get("/", (req, res) => res.send("Hello World!"));



io.on("connection", function(socket) {
  socket.on("join_room", function(data) {
    console.log(data);

    socket.join(data.room);
  });

  socket.on("playSong", function(data) {
    console.log(data);


    socket.broadcast.emit('newclientconnect',{ description: ' clients connect'});
  });
});

server.listen(process.env.PORT || 5000);
