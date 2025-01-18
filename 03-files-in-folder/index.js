const fsPromises = require('fs').promises;
const path = require('path');
const pathToFolder = path.join(__dirname, 'secret-folder');

fsPromises
  .readdir(pathToFolder, { withFileTypes: true })
  .then((results) => {
    results.forEach((result) => {
      if (result.isFile()) {
        const filePath = path.join(pathToFolder, result.name);
        const fileName = path.basename(result.name, path.extname(result.name));
        const fileExt = path.extname(result.name).slice(1);

        fsPromises
          .stat(filePath)
          .then((stats) => {
            console.log(
              `${fileName} - ${fileExt} - ${(stats.size / 1024).toFixed(3)}kb`,
            );
          })
          .catch((err) => {
            console.error(`Failed to get file information: ${err.message}`);
          });
      }
    });
  })
  .catch((err) => {
    console.error(`Failed to read folder contents: ${err.message}`);
  });
