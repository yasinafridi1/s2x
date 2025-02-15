const { unlink, existsSync, mkdirSync } = require("fs");
const path = require("path");
const deleteFile = (fileName) => {
  const filePath = path.join(__dirname, `../uploads/${fileName}`);
  unlink(filePath, (err) => {
    if (err) {
      console.log(`Couldnot delete file ${filePath}`);
    }
    return;
  });
};

const makeRequiredDirectories = () => {
  const directories = ["uploads"];
  directories.forEach((directory) => {
    const dir = path.join(__dirname, `../${directory}`);
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
  });
};

module.exports = { deleteFile, makeRequiredDirectories };
