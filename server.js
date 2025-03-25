const net = require("net");
const fs = require("node:fs/promises");

const server = net.createConnection(() => {});

server.on("connection", (socket) => {
  console.log("New Connection!");

  socket.on("data", async (data) => {
    //file is opened
    const fileHandle = await fs.open(`storage/test.txt`, "w");
    //Read from the socket and write to the stream
    //creating stream of this fileHandle
    const fileStream = fileHandle.createWriteStream();
    fileStream.write(data);
  });
});

server.listen("5000", "::1", () => {
  console.log(`Uploader server opened on`, server.address());
});
