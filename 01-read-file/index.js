const fs = require("fs");
const { stdout } = process;

const path = require("path");
const pathToFile = path.join(__dirname, "text.txt");
const readableStream = fs.createReadStream(pathToFile, "utf-8");
readableStream.on("data", (chunk) => {
  stdout.write(chunk);
});
