const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: [
      "http://127.0.0.1:5173",
      "http://localhost:5173",
      process.env.CLIENT_URL_1,
      process.env.CLIENT_URL_2
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

require("./socket/socketHandler")(io);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});