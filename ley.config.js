const setPostgresDefaultsOnHeroku = require('./utils/setPostgresDefaultsOnHeroku');

setPostgresDefaultsOnHeroku();

const options = {};

if (process.env.NODE_ENV === 'production') {
  options.ssl = {
    require: true,
    rejectUnauthorized: false,
  };
}

module.exports = options;
