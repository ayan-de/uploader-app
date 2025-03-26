const net = require("net");
const fs = require("fs/promises");
const path = require("path");

const socket = net.createConnection({ host: "::1", port: 5000 }, async () => {
  // const filePath = "./text.txt";
  //command format "[node, client.js, text.txt]"
  filePath = process.argv[2];
  //fileName contains the final name of the path given
  const fileName = path.basename(filePath);
  const fileHandle = await fs.open(filePath, "r");
  //readble stream
  const fileReadStream = fileHandle.createReadStream();

  socket.write(`filename: ${fileName}-------`);

  //Reading from source file
  fileReadStream.on("data", (data) => {
    if (
      //this is means that our internal buffer is full
      //and we should not write more
      !socket.write(data)
    ) {
      fileReadStream.pause();
    }
  });

  //drain event on socket because it is used to write to it
  socket.on("drain", () => {
    fileReadStream.resume();
  });

  fileReadStream.on("end", () => {
    console.log("File was successfully uploaded");
    socket.end();
  });
});
