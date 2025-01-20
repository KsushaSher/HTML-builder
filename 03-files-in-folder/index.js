const fsPromises = require('fs').promises;
const path = require('path');
const pathToFolder = path.join(__dirname, 'secret-folder');

async function displayInformation() {
  try {
    const files = await fsPromises.readdir(pathToFolder, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(pathToFolder, file.name);
        const fileName = path.basename(file.name, path.extname(file.name));
        const fileExt = path.extname(file.name).slice(1);
        const stats = await fsPromises.stat(filePath);
        console.log(
          `${fileName} - ${fileExt} - ${(stats.size / 1024).toFixed(3)}kb`,
        );
      }
    }
  } catch (err) {
    console.error(`Failed to read folder contents: ${err.message}`);
  }
}

displayInformation();
