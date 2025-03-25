const net = require("net");

const server = net.createConnection(() => {});

server.on("connection", (socket) => {
  console.log("New Connection!");
});

server.listen("5000", "::1", () => {
  console.log(`Uploader server opened on`, server.address());
});
