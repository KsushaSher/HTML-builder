const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const pathToBundleFolder = path.join(__dirname, 'project-dist');
const pathToStylesFolder = path.join(__dirname, 'styles');

async function getBundleCss() {
  try {
    await fsPromises.mkdir(pathToBundleFolder, { recursive: true });
    const filesInStyles = await fsPromises.readdir(pathToStylesFolder, {
      withFileTypes: true,
    });

    const output = fs.createWriteStream(
      path.join(pathToBundleFolder, 'bundle.css'),
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
    console.error(`Failed to create bundle: ${err.message}`);
  }
}
getBundleCss();
