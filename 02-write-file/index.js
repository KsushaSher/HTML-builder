const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = process;
const pathName = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathName);
stdout.write('Please, enter text:\n');

const farewellMessage = () => {
  stdout.write('You went out.');
  exit();
};

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    farewellMessage();
  }
  output.write(data);
});
process.on('SIGINT', farewellMessage);
