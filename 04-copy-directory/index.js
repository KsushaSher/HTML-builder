const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const pathToNewFolder = path.join(__dirname, 'files-copy');

async function folderExists(folderPath) {
  try {
    await fsPromises.access(folderPath);
    return true;
  } catch {
    return false;
  }
}

async function copyDir() {
  try {
    const exists = await folderExists(pathToNewFolder);
    if (exists) {
      await fsPromises.rm(pathToNewFolder, { recursive: true, force: true });
    }
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
