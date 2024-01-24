const { constants } = require('buffer');
const fs = require('fs');
const fsp = fs.promises;
const path = require("path");

const srcPath = path.join(__dirname, "files");
const destPath = path.join(__dirname, "files-copy");

fs.access(destPath, constants.F_OK, async (err) => {
  if (!err) {
    await fsp.rm(destPath, { recursive: true });
  }
  await fsp.mkdir(destPath);
  copyDir();
});

function copyDir() {
  fs.readdir(srcPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err); 
    } else {
      files.forEach(file => {
        if (file.isFile()) {
          const src = path.join(srcPath, file.name);
          const dest = path.join(destPath, file.name);
          fs.copyFile(src, dest, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  });
}