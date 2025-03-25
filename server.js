const net = require("net");
const fs = require("node:fs/promises");

const server = net.createServer(() => {});

let fileHandle, fileWriteStream;

server.on("connection", (socket) => {
  console.log("New Connection!");

  socket.on("data", async (data) => {
    //if-else added to make sure that the file is opened only
    //once when the connection is established and started getting data
    //not everytime when we get data
    //so this if block runs only once(at the initial time)
    if (!fileHandle) {
      //pause receiving data from client
      socket.pause();
      //file is opened
      fileHandle = await fs.open(`storage/test.txt`, "w");
      //Read from the socket and write to the stream
      //creating writeable stream of this fileHandle
      fileWriteStream = fileHandle.createWriteStream();
      //writing to our destination file
      fileWriteStream.write(data);

      //resume receiving data from client
      socket.resume();

      //drain event is only for writeable stream
      fileWriteStream.on("drain", () => {
        socket.resume();
      });
    } else {
      if (
        //false: Indicates the stream's internal buffer is full, and you should pause writing
        //writing to our destination file
        !fileWriteStream.write(data)
      ) {
        socket.pause();
      }
    }
  });
  //this event happens when the client.js file ends the socket
  socket.on("end", () => {
    fileHandle.close();
    fileHandle = undefined;
    fileWriteStream = undefined;
    console.log("Connection Ended");
  });
});

server.listen("5000", "::1", () => {
  console.log(`Uploader server opened on`, server.address());
});
