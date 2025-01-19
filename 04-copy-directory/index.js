const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const pathToNewFolder = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fsPromises.mkdir(pathToNewFolder, { recursive: true });
    const files = await fsPromises.readdir(path.join(__dirname, 'files'));
    for (const file of files) {
      const sourceFile = path.join(__dirname, 'files', file);
      const newFile = path.join(pathToNewFolder, file);
      const stat = await fsPromises.stat(sourceFile);
      if (stat.isFile()) {
        await fsPromises.copyFile(sourceFile, newFile);
      }
    }
    console.log('Folder copied successfully!');
  } catch (err) {
    console.error(`Failed to copy: ${err.message}`);
  }
}
copyDir();
