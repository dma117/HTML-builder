const fs = require('fs');
const path = require("path");

const srcPath = path.join(__dirname, "styles");
const destPath = path.join(__dirname, "project-dist", "bundle.css");
copyDir();

function copyDir() {
  fs.readdir(srcPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err); 
    } else {
      const writableStream = fs.createWriteStream(path.join(destPath));
      files.forEach(file => {
        if (file.isFile() && path.extname(path.join(srcPath, file.name)) === '.css') {
          const readableStream = fs.createReadStream(path.join(srcPath, file.name));
          readableStream.pipe(writableStream, { end: false });
        }
      });
    }
  });
}