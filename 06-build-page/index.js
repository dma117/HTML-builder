const { constants } = require('buffer');
const fs = require('fs');
const fsp = fs.promises;
const path = require("path");

const htmlSrcPath = path.join(__dirname, "template.html");
const componentsSrcPath = path.join(__dirname, "components");
const stylesSrcPath = path.join(__dirname, "styles");
const assetsSrcPath = path.join(__dirname, "assets");
const destPath = path.join(__dirname, "project-dist");
const stylesDestPath = path.join(__dirname, "project-dist", "style.css");
const assetsDestPath = path.join(__dirname, "project-dist", "assets");
const htmlDestPath = path.join(destPath, "index.html");

fs.access(destPath, constants.F_OK, (err) => {
  if (err) {
    fsp.mkdir(destPath).then(() => {
      updateMainDir();
    }).catch(err => console.log(err));
  } else {
    fsp.rm(destPath, { recursive: true }).then(() => {
      fsp.mkdir(destPath).then(() => {
        updateMainDir();
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }
});

function updateMainDir() {
  fs.access(assetsDestPath, constants.F_OK, (err) => {
    if (err) {
      fsp.mkdir(assetsDestPath).then(() => {
        copyAssets(assetsSrcPath);
      }).catch(err => console.log(err));
    }
  });
  bundleStyles();
  importComponents();
}

function copyAssets(src) {
  fs.readdir(src, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err); 
    } else {
      const root = path.join(__dirname);
      files.forEach(file => {
        if (file.isFile()) {
          const from = path.join(src, file.name);
          const to = path.join(destPath, src.replace(root, ''), file.name);
          fs.copyFile(from, to, (err) => {
            if (err) {
              console.log(err);
            }
          });
        } else {
          const folderPath = path.join(destPath, src.replace(root, ''), file.name);
          fs.access(folderPath, constants.F_OK, (err) => {
            if (err) {
              fsp.mkdir(folderPath).then(() => {
                copyAssets(path.join(src, file.name));
              }).catch(err => console.log(err));
            }
          });
        }
      });
    }
  });
}

function bundleStyles() {
  fs.readdir(stylesSrcPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err); 
    } else {
      const writableStream = fs.createWriteStream(path.join(stylesDestPath));
      files.forEach(file => {
        if (file.isFile() && path.extname(path.join(stylesSrcPath, file.name)) === '.css') {
          const readableStream = fs.createReadStream(path.join(stylesSrcPath, file.name));
          readableStream.pipe(writableStream, { end: false });
        }
      });
    }
  });
}

async function importComponents() {
  try {
    let htmlData = await fsp.readFile(htmlSrcPath, 'utf-8');
    const files = await fsp.readdir(componentsSrcPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && path.extname(path.join(componentsSrcPath, file.name)) === '.html') {
        const fileExt = path.extname(file.name);
        const pathToFile = path.join(componentsSrcPath, file.name);
        const fileName = path.basename(pathToFile, fileExt);
        const data = await fsp.readFile(path.join(componentsSrcPath, file.name), 'utf-8');
        const regexp = new RegExp(`{{${fileName}}}`, 'g');
        htmlData = htmlData.replace(regexp, data);
      }
    }
    await fsp.writeFile(htmlDestPath, htmlData);
  } catch (err) {
    console.log(err);
  }
}