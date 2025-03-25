const net = require("net");
const fs = require("fs/promises");

const socket = net.createConnection({ host: "::1", port: 5000 }, async () => {
  const filePath = "./text.txt";
  const fileHandle = await fs.open(filePath, "r");
  const fileStream = fileHandle.createReadStream();

  fileStream.on("data", () => {
    socket.write(data);
  });
});
