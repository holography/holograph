'use strict';

const yaml = require('js-yaml');
const fs = require('fs');

function configLoader() {
}


configLoader.prototype.load = function () {

  if (this._hasJSConfig()) {
    return this._loadJsConfig();
  }

  if (this._hasYAMLConfig()) {
    return this._loadYamlConfig();
  }

};

configLoader.prototype._loadJsConfig = function () {
  return require('./holograph_config');
};

configLoader.prototype._loadYamlConfig = function () {
  const yamlConfig = fs.readFileSync('holograph_config.yml');
  return yaml.safeLoad(yamlConfig);
};

configLoader.prototype._hasYAMLConfig = function () {

  try {
    fs.statSync('holograph_config.yml');
  } catch (err) {
    return false;
  }

  return true;

};

configLoader.prototype._hasJSConfig = function () {

  try {
    fs.statSync('holograph_config.js');
  } catch (err) {
    return false;
  }

  return true;

}

module.exports = configLoader;