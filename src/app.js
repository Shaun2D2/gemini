const _cliProgress = require('cli-progress');
const mongoose = require('mongoose');
const casual = require('casual');
const path = require('path');
const fs = require('fs');

/**
 * load in the code templates
 *
 */
const rcTemplate = require('./templates/rc');
const seederTemplate = require('./templates/seeder');

// TODO:
// split out code into template files
// add a teardown command
// actually seed the database

require('yargs')
.command(
  'init',
  'setup seeder structure',
  () => {
      const databasePath = fs.existsSync('./database');

      if(!fs.existsSync(path.resolve(__dirname, './\.geminirc'))) {
          fs.writeFileSync('./.geminirc', rcTemplate)
      }

      if(!databasePath) {
          fs.mkdirSync('database');
      }

      const seederPath = fs.existsSync('./database/seeder');

      if(!seederPath) {
          fs.mkdirSync('./database/seeder');
      }

      fs.writeFileSync('./database/seeder/example.js', seederTemplate);

      console.log('setup complete...');
  }
)
.command(
  'seed',
  'seed some fancy data',
  () => {
      const progress = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
      const seederPath = 'database/seeder';
      const config = JSON.parse(fs.readFileSync('./.geminirc', { encoding: 'utf8' }));

      mongoose.connect(config.uri);

      mongoose.connection.on('connected', async () => {
          const files = fs.readdirSync(`./${seederPath}`, { encoding: 'utf8' });

          progress.start(files.length, 0)

          for(const [index, file] of files.entries()) {

              const seeder = require(path.join(process.cwd(), `${seederPath}/${file}`));

              await seeder.default.up(casual);

              progress.update(index + 1);
          }

          progress.stop();

          process.exit();
      });
  }
)
.argv
