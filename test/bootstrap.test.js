require('dotenv').config()
const debug = require('debug');
const should = require('should');
const log = debug('awsome-factory');
const require_tree = require('require-tree')
const { Sequelize, Model } = require('sequelize');

log('starting tests');

before((done) => {
  global.should = should;
  global.sequelize = new Sequelize(
    process.env.AFA_DB_NAME,
    process.env.AFA_DB_USER,
    process.env.AFA_DB_PASS, {
      host: process.env.AFA_DB_HOST,
      port: process.env.AFA_DB_PORT,
      dialect: process.env.AFA_DB_DIALECT,
      logging: log,
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false
        }
      }
  });
  global.Sequelize = sequelize;

  log('to authenticate');

  sequelize.authenticate().then(() => {
    log('Connection has been established successfully.');
    const models = require_tree('../api/models');

    for (const modelName in models) {
      const modelDefinition = models[modelName];
      const { attributes, options } = modelDefinition;
      log(`Defining model ${modelName}`);
      const modelClass = sequelize.define(modelName, attributes, options);
      global[modelClass] = modelClass;

      if (!options) {
        continue;
      }
      if(options.classMethods) {
        Object.keys(options.classMethods).forEach(
          function defClassMethod(cm) {
            modelClass[cm] = options.classMethods[cm];
          }
        );
      }

      if(options.instanceMethods) {
        Object.keys(options.instanceMethods).forEach(
          function defInstanceMethod(im) {
            modelClass.prototype[im] = options.instanceMethods[im];
          }
        );
      }

    }
/*
    for (const modelName in models) {
      const modelDefinition = models[modelName];

      if (typeof modelDefinition.associations === 'function') {
        log(`Loading associations for ${modelName}`);
        modelDefinition.associations(modelDefinition);
      }
    }*/

    console.log({m: sequelize.models});
    console.dir(global);

    done();
  });
});

describe('true', () => {
  it('is right', (done) => {
    ({ d: true }).should.have.property('d');
    done();
  })
});

/*
beforeEach(() => {
  let models = [];
  for (let model in sails.models){
    models.push(sails.models[model]);
  }
  return Promise.map(models, (model) => {
    return model.destroy({where: {}, force:true});
  });
});
*/
