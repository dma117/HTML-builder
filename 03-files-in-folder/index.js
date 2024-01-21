const fs = require('fs');
const path = require("path");
const { EOL } = require("os");
const { stdout } = process;

const pathToFile = path.join(__dirname, "secret-folder");

fs.readdir(pathToFile, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err); 
  }
  else {
    files.forEach(file => {
      if (file.isFile()) {
        fs.stat(path.join(pathToFile, file.name), (err, stats) => {
          if (err) {
            console.log(err);
          } else {
            const fileExt = path.extname(file.name);
            const fileName = path.basename(path.join(pathToFile, file.name), fileExt);
            const fileSize = stats.size;
            stdout.write(`${fileName} - ${fileExt} - ${fileSize}b${EOL}`);
          }
        });
      }
    })
  }
})
