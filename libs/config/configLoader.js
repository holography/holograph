'use strict';

const yaml = require('js-yaml');
const fs = require('fs');

/**
 * Load configuration from files.
 *
 * @class
 */
function configLoader() {
}

/**
 * Load configuration from either a JS or YAML file.
 *
 * @throws {Error} Thrown if no YAML or JavaScript config file is found.
 *
 * @returns {object} Holograph configuration.
 */
configLoader.prototype.load = function () {

  if (this.hasJSConfig()) {
    return this.loadJsConfig();
  }

  if (this.hasYAMLConfig()) {
    return this.loadYamlConfig();
  }

  // If we've not been able to find a config file, then bomb out.
  throw new Error('No holograph configuration file found.');

};

/**
 * Load a JavaScript based configuration file.
 *
 * @returns {object} Holograph configuration loaded from a JavaScript file.
 */
configLoader.prototype.loadJsConfig = function () {
  return require('./holograph_config');
};

/**
 * Load a YAML based configuration file.
 *
 * @returns {object} Holograph configuration loaded from a YAML file.
 */
configLoader.prototype.loadYamlConfig = function () {
  // We don't really need to wrap this in a try/catch as chekcing for the existence of this file hapens directly prior
  // to loading it in. Maybe.
  const yamlConfig = fs.readFileSync('holograph_config.yml');
  return yaml.safeLoad(yamlConfig);
};

/**
 * Check to see if a YAML config file exists.
 *
 * @returns {bool} True if a YAML config file exists, false if not.
 */
configLoader.prototype.hasYAMLConfig = function () {

  try {
    fs.statSync('holograph_config.yml');
  } catch (err) {
    return false;
  }

  return true;

};

/**
 * Check to see if a JavaScript config file exists.
 *
 * @returns {bool} True if a JavaScript config file exists, false if not.
 */
configLoader.prototype.hasJSConfig = function () {

  try {
    fs.statSync('holograph_config.js');
  } catch (err) {
    return false;
  }

  return true;

}

module.exports = configLoader;