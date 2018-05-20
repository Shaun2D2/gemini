const { exec } = require('child_process');
const fs = require('fs');

require('yargs')
.command(
  'init',
  'setup seeder structure',
  () => {
      const databasePath = fs.existsSync('./database');

      if(!databasePath) {
          fs.mkdirSync('database');
      }

      const seederPath = fs.existsSync('./database/seeder');

      if(!seederPath) {
          fs.mkdirSync('./database/seeder');
      }

      fs.writeFileSync('./database/seeder/sample.js',
      `
          import fs from 'fs';

          console.log('hello world this is babel-node saying yo g');
      `);

      console.log('complete...');
  }
)
.command(
  'seed',
  'seed some fancy data',
  () => {
      const comm = exec(`babel-node ./database/seeder/index.js`);

      comm.stdout.on('data', (data) => console.log(data));
  }
)
.argv
