const net = require("net");
const fs = require("node:fs/promises");

const server = net.createServer(() => {});

let fileHandle, fileStream;

server.on("connection", (socket) => {
  console.log("New Connection!");

  socket.on("data", async (data) => {
    //if-else added to make sure that the file is opened only
    //once when the connection is established and started getting data
    //not everytime when we get data
    if (!fileHandle) {
      //file is opened
      fileHandle = await fs.open(`storage/test.txt`, "w");
      //Read from the socket and write to the stream
      //creating stream of this fileHandle
      fileStream = fileHandle.createWriteStream();
      //writing to our destination file
      fileStream.write(data);
    } else {
      //writing to our destination file
      fileStream.write(data);
    }
  });

  socket.on("end", () => {
    console.log("Connection Ended");
    fileHandle.close();
  });
});

server.listen("5000", "::1", () => {
  console.log(`Uploader server opened on`, server.address());
});
