const path = require('path');
const mongoose = require(path.join(process.cwd(), 'node_modules/mongoose'));

const connect = (config) => {

    mongoose.Promise = global.Promise;
    /**
     * connect to our mongoose instance with the uri provided
     * in the config file.
     *
     */
    mongoose.connect(config.uri, { useMongoClient: true });

    return new Promise((res, rej) => {
        return mongoose.connection.on('connected', () => {
            console.log('standby for seeding...');
            return res();
        });
    });
}

module.exports = { connect };
