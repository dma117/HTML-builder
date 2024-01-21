const fs = require("fs");
const path = require("path");
const { stdin, stdout } = process;
const { EOL } = require("os");

const pathToFile = path.join(__dirname, "text.txt");
const output = fs.createWriteStream(pathToFile, {flags: 'a'});
stdout.write(`Hello! I'm waiting for your text...${EOL}`);

stdin.on("data", (data) => {
  const dataStr = data.toString();
  const regexp = new RegExp(`^exit${EOL}`);
  const result = dataStr.match(regexp) || [];
  if (result.length === 0) {
    output.write(dataStr);
  } else {
    process.exit();
  }
});

process.on("SIGINT", () => {
  process.exit(1);
});

process.on("exit", (state = 0) => {
  output.end();
  if (state === 1) {
    stdout.write(EOL);
  }
  stdout.write(`I'm leaving... Have a good day!${EOL}`);
});
