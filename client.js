const net = require("net");
const fs = require("fs/promises");
const path = require("path");

//dir means direction
const clearLine = (dir) => {
  return new Promise((resolve, rejects) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

//dir means direction
const moveCursor = (dx, dy) => {
  return new Promise((resolve, rejects) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

const socket = net.createConnection({ host: "::1", port: 5000 }, async () => {
  // const filePath = "./text.txt";
  //command format "[node, client.js, text.txt]"
  filePath = process.argv[2];
  //fileName contains the final name of the path given
  const fileName = path.basename(filePath);
  const fileHandle = await fs.open(filePath, "r");
  //readble stream
  const fileReadStream = fileHandle.createReadStream();

  //calculate the size of the file in bytes
  const fileSize = (await fileHandle.stat()).size;

  //for howing the upload progress
  let uploadPercentage = 0;
  let bytesUploaded = 0;

  socket.write(`filename: ${fileName}-------`);

  //this log helps us showing uploading percentage without deleting the actual commande by client
  console.log();
  //show progress bar while uploading the file
  const renderProgressBar = (percentage) => {
    const totalBars = 50;
    const filledBars = Math.floor((percentage / 100) * totalBars);
    const emptyBars = totalBars - filledBars;
    const progressBar = `[${"#".repeat(filledBars)}${" ".repeat(
      emptyBars
    )}] ${percentage}%`;
    return progressBar;
  };

  //Reading from source file
  fileReadStream.on("data", async (data) => {
    if (
      //this is means that our internal buffer is full
      //and we should not write more
      !socket.write(data)
    ) {
      fileReadStream.pause();
    }
    //add the number of bytes read to the variables
    bytesUploaded = data.length;
    let newPercentage = Math.floor((bytesUploaded / fileSize) * 100);

    if (newPercentage != uploadPercentage) {
      uploadPercentage = newPercentage;
      await moveCursor(0, -1);
      await clearLine(0);
      // console.log(`Uploading...${uploadPercentage}%`);
      console.log(renderProgressBar(uploadPercentage));
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
