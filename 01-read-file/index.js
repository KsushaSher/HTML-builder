const fs = require('fs');
const path = require('path');
const { stdout } = process;
const name = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(name, 'utf-8');
stream.on('data', (data) => stdout.write(data));
