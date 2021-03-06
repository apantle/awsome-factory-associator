const Promise = require('bluebird');
const Collection = require('./Collection');

function getValidFinalFactoryName(config, options) {
  const factoryNameInOptions =
    typeof options == 'object' ? options._factoryName : undefined;
  const factoryNameInConfig = config ? config.factoryName : undefined;
  const finalFactoryName = factoryNameInOptions || factoryNameInConfig;

  if (!finalFactoryName) {
    throw new Error(
      'A valid factory name should be provided for association in factory '
    );
  }

  if (factoryNameInOptions) {
    delete options._factoryName;
  }
  return finalFactoryName;
}

function clone(object) {
  if (object instanceof Collection) {
    return object;
  } else if (Array.isArray(object)) {
    return object.map(clone);
  } else if (typeof object == 'object') {
    if (object === null) {
      return null;
    }
    if (object instanceof Date) {
      return new Date(object);
    }

    const objectConed = {};

    for (const key in object) {
      objectConed[key] = clone(object[key]);
    }
    return objectConed;
  } else {
    return object;
  }
}

function getIfSavedAtttribute(saved, phrase) {
  const isASavedPhrase = typeof phrase == 'string' && phrase.charAt(0) == '$';

  if (!isASavedPhrase) {
    return phrase;
  }
  const cleanPhras = phrase.slice(1);
  const splited = cleanPhras.split('.');
  const savedAs = splited[0];
  const savedModel = saved[savedAs];

  if (!savedModel) {
    throw new Error('No definition saved with name ' + savedAs);
  }

  let finalValue = savedModel;
  const regexp = /([^\(\)]+)(\(.*\)$)?/;

  try {
    for (let i = 1; i < splited.length; i++) {
      const match = regexp.exec(splited[i]);

      if (!match) {
        throw new Error('Sintaxis error in phrase ' + phrase);
      }
      finalValue = finalValue[match[1]];
      const isFunctionCall = match[2] != undefined;

      if (isFunctionCall) {
        if (!finalValue) {
          throw new Error('Invalid name : ' + match[1] + ' function');
        }
        const args = match[2].slice(1, -1).split(',');

        finalValue = finalValue.apply(null, args);
      }
    }
  } catch (err) {
    throw new Error(
      'Error while obtaining value from saved object using phrase ' + phrase
    );
  }

  return finalValue;
}
module.exports = {
  clone: clone,

  getIfSavedAtttribute: getIfSavedAtttribute,

  getArrayOfOptionsFromObject: (object) => {
    if (typeof object._size != 'number') {
      throw new Error('A valid size must be provided with the key _size');
    }
    const size = object._size;
    const prefix = object.$;
    const arrayOptions = [];

    delete object._size;

    for (let i = 0; i < size; i++) {
      if (prefix) {
        object.$ = prefix + i;
      }
      arrayOptions.push(clone(object));
    }

    return arrayOptions;
  },

  //Quiza en factory
  generateFromOptionsObject: (
    method,
    factory,
    optionsObject,
    associationConfig,
    saved
  ) => {
    //Allow options using saved
    optionsObject = getIfSavedAtttribute(saved, optionsObject);

    //Allow creation by id
    const assingedById = typeof optionsObject === 'number';

    if (assingedById) {
      return Promise.resolve(optionsObject);
    }

    //Create from object
    factoryName = getValidFinalFactoryName(associationConfig, optionsObject);

    const definition = factory.createDefinitionFromTemplate(
      factoryName,
      optionsObject
    );

    return definition[method](saved).then((modelAssociated) => {
      return modelAssociated.id;
    });
  },

  generateFromOptionsObjectAfter: (
    method,
    factory,
    optionsObject,
    associationConfig,
    createdInstance,
    saved
  ) => {
    //Allow options using saved
    optionsObject = getIfSavedAtttribute(saved, optionsObject);

    //Not Allow creation by id
    const assingedById = typeof optionsObject === 'number';

    if (assingedById) {
      throw new Error(
        'Ids can not be passed in ' +
          associationConfig.as +
          ' since it is a HasOne or HasMany association.'
      );
    }

    //Create from object
    factoryName = getValidFinalFactoryName(associationConfig, optionsObject);
    if (!optionsObject) {
      optionsObject = {};
    }
    optionsObject[associationConfig.foreignKey] = createdInstance.id;

    const definition = factory.createDefinitionFromTemplate(
      factoryName,
      optionsObject
    );

    return definition[method](saved).then((modelAssociated) => {
      return modelAssociated.id;
    });
  }
};
