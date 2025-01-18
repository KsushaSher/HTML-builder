const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = process;
const pathName = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathName);
stdout.write('Please, enter text:\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdout.write('You went out.\n');
    exit();
  }
  output.write(data);
});
process.on('SIGINT', () => {
  stdout.write('\nYou went out.\n');
  exit();
});
