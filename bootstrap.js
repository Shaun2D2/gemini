const register = require("babel-register");

register({
  presets: ['es2015']
});

require('./src/app');
