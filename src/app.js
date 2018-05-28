const _cliProgress = require('cli-progress');
const db = require('./scripts/database');
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
      /**
       * lets read in the config file for settings
       *
       */
      const config = JSON.parse(fs.readFileSync('./.geminirc', { encoding: 'utf8' }));

      db.connect(config).then( async () => {

          /**
           * setup progress bar
           *
           */
          const progress = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);

          /**
           * determine seeder path based on default or config file
           *
           */
          const seederPath = config.path.length > 0 ? config.path : 'database/seeder';

          /**
           * get all the files we are going to work with
           *
           */
          const files = config.order.length > 0 ? config.order : fs.readdirSync(`./${seederPath}`, { encoding: 'utf8' });

          /**
           * setup progress bar length
           *
           */
          progress.start(files.length, 0);

          /**
           * loop through and seed the things while you update the progress bar like a champ
           *
           */
          for(const [index, file] of files.entries()) {

              const seeder = require(path.join(process.cwd(), `${seederPath}/${file}`));

              await seeder.default.up(casual);

              progress.update(index + 1);
          }

          /**
           * stop the progress bar
           *
           */
          progress.stop();

          /**
           * exit the process
           *
           */
          process.exit();
      })
      .catch((e) => {
          console.log(e);

          process.exit();
      });

  }
)
.argv
