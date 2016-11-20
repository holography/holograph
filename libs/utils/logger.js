'use strict';

const logger = require("eazy-logger").Logger({
  prefix: '{blue:[}{magenta:Holograph}{blue:] }',
  useLevelPrefixes: true
});

/**
 * Log an error that fails a build.
 *
 * @param {Error} err
 */
logger.logFailingError = function (error) {

  if (typeof error !== 'undefined') {
    this.error(error.toString());
  }

  this.error('Build failed (╯°□°）╯︵ ┻━┻)');

};

/**
 * Log a build sucessful message.
 */
logger.logSuccessfulBuild = function () {
  this.info('Build successful \\o\/');
};

module.exports = logger;