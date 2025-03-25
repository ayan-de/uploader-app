const net = require("net");
const fs = require("fs/promises");

const socket = net.createConnection({ host: "::1", port: 5000 }, async () => {
  const filePath = "./text.txt";
  const fileHandle = await fs.open(filePath, "r");
  const fileStream = fileHandle.createReadStream();

  //Reading from source file
  fileStream.on("data", (data) => {
    socket.write(data);
  });

  fileStream.on("end", () => {
    console.log("File was successfully uploaded");
    socket.end();
  });
});
