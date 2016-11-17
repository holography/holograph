'use strict';

const yaml = require('js-yaml');
const fs = require('fs');

function configLoader() {
  this.configType = this.getConfigExtension();
}

configLoader.prototype.load = function () {

  if (this.configType === 'yml') {
    return this._loadYamlConfig();
  }

  if (this.configType === 'js') {
    return this._loadJsConfig();
  }

};

configLoader.prototype._loadJsConfig = function () {
  const jsConfig = require('./holograph_config');
  return jsConfig;
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

configLoader.prototype.getConfigExtension = function () {

  if (this._hasJSConfig()) {
    return 'js';
  }

  if (this._hasYAMLConfig()) {
    return 'yml';
  }

};

module.exports = configLoader;