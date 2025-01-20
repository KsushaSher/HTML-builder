const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const pathToDistFolder = path.join(__dirname, 'project-dist');
const pathToStylesFolder = path.join(__dirname, 'styles');

async function folderExists(folderPath) {
  try {
    await fsPromises.access(folderPath);
    return true;
  } catch {
    return false;
  }
}
async function deleteFolder() {
  try {
    const exists = await folderExists(pathToDistFolder);
    if (exists) {
      await fsPromises.rm(pathToDistFolder, { recursive: true, force: true });
    }
    await fsPromises.mkdir(pathToDistFolder, { recursive: true });
  } catch (err) {
    console.error(`Error deleting folder: ${err.message}`);
  }
}

async function getBundleCss() {
  try {
    const filesInStyles = await fsPromises.readdir(pathToStylesFolder, {
      withFileTypes: true,
    });

    const output = fs.createWriteStream(
      path.join(pathToDistFolder, 'style.css'),
    );

    for (const file of filesInStyles) {
      const fileExt = path.extname(file.name);
      const pathToFile = path.join(pathToStylesFolder, file.name);

      if (fileExt === '.css') {
        const input = fs.createReadStream(pathToFile, 'utf-8');
        await new Promise((resolve, reject) => {
          input.pipe(output, { end: false });
          input.on('end', resolve);
          input.on('error', reject);
        });
      }
    }
    output.end();
  } catch (err) {
    console.error(`Failed to create style.css: ${err.message}`);
  }
}

async function copyAssetsFolder() {
  try {
    const newPathToFile = await fsPromises.mkdir(
      path.join(__dirname, 'project-dist', 'assets'),
      {
        recursive: true,
      },
    );

    const files = await fsPromises.readdir(path.join(__dirname, 'assets'));

    for (const file of files) {
      const sourceFile = path.join(__dirname, 'assets', file);
      const newFile = path.join(newPathToFile, file);

      const stat = await fsPromises.stat(sourceFile);
      if (stat.isFile()) {
        await fsPromises.copyFile(sourceFile, newFile);
      } else if (stat.isDirectory()) {
        const newFolderPath = path.join(newPathToFile, file);
        await fsPromises.mkdir(newFolderPath, { recursive: true });
        await copyDirectoryContent(sourceFile, newFolderPath);
      }
    }
    console.log('Folder assets copied successfully!');
  } catch (err) {
    console.error(`Failed to copy assets folder: ${err.message}`);
  }
}

async function copyDirectoryContent(sourceDir, targetDir) {
  try {
    const files = await fsPromises.readdir(sourceDir);
    for (const file of files) {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);
      const stat = await fsPromises.stat(sourceFile);

      if (stat.isFile()) {
        await fsPromises.copyFile(sourceFile, targetFile);
      } else if (stat.isDirectory()) {
        await fsPromises.mkdir(targetFile, { recursive: true });
        await copyDirectoryContent(sourceFile, targetFile);
      }
    }
  } catch (err) {
    console.error(`Error copying folder: ${err.message}`);
  }
}

async function main() {
  await deleteFolder();
  await getBundleCss();
  await copyAssetsFolder();
}

main();
