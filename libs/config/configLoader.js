'use strict';

const yaml = require('js-yaml');
const fs = require('fs');

function configLoader() {}

configLoader.prototype.load = function () {
  return yaml.safeLoad(fs.readFileSync('holograph_config.yml', 'utf8'));
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