require('dotenv').config();
const debug = require('debug');
const should = require('should');
const log = debug('awsome-factory');
const _ = require('lodash');
const require_tree = require('require-tree');
const { Sequelize } = require('sequelize');

log('starting tests');
let conn;

before((done) => {
  const { AFA_LOGGING: logOption } = process.env;
  const logger = logOption === 'console'
    ? console.log
    : logOption === 'debug'
      ? log
      : false;

  let dialectOptions;
  try {
    dialectOptions = JSON.parse(process.env.AFA_DB_DIALECT_OPTIONS)
  } catch (e) {
    dialectOptions = {};
  }

  global.should = should;
  global.SequelizeConn = conn = new Sequelize({
    database: process.env.AFA_DB_NAME,
    username: process.env.AFA_DB_USER,
    password: process.env.AFA_DB_PASS,
    host: process.env.AFA_DB_HOST,
    port: process.env.AFA_DB_PORT,
    dialect: process.env.AFA_DB_DIALECT,
    logging: logger,
    dialectOptions
  });

  log('to authenticate');
  SequelizeConn.authenticate().then(() => {
    log('Connection has been established successfully.');
    const models = require_tree('../api/models');

    for (const modelName in models) {
      const modelDefinition = models[modelName];
      const { attributes, options } = modelDefinition;
      log(`Defining model ${modelName}`);
      const modelClass = SequelizeConn.define(modelName, attributes, options);
      global[modelName] = modelClass;

      if (!options) {
        continue;
      }
      if (options.classMethods) {
        Object.keys(options.classMethods).forEach(function defClassMethod(cm) {
          modelClass[cm] = options.classMethods[cm];
        });
      }

      if (options.instanceMethods) {
        Object.keys(options.instanceMethods).forEach(function defInstanceMethod(
          im
        ) {
          modelClass.prototype[im] = options.instanceMethods[im];
        });
      }
    }

    for (const modelName in models) {
      const modelDefinition = models[modelName];

      if (typeof modelDefinition.associations === 'function') {
        log(`Loading associations for ${modelName}`);
        modelDefinition.associations(modelDefinition);
      }
    }

    (async function () {
      await SequelizeConn.sync({});
      /**
       *
       * @type {Factory}
       */
      global.factory = require('../index.js');
      factory.load();
    })().then(done);
  });
});

after((done) => {
  if (process.argv.includes('--skip-drop')) {
    done();
    return;
  }
  (async function (models) {
    for (const modelName in models) {
      if (!models.hasOwnProperty(modelName)) {
        continue;
      }
      const model = conn.model(modelName);
      await model.destroy({ force: true, where: {} });
    }
  })(conn.models).then(done);
});
