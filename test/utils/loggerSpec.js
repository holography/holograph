'use strict';

// Module imports.
const expect = require('chai').expect;
const eazy = require('eazy-logger');

// SUT.
const logger = require('../../libs/utils/logger');

describe('logger', function () {

  it('extends eazy-logger', function () {

    expect(logger).to.be.an.instanceof(eazy.Logger);

  });

  it('adds a custom prefix to log messages', function () {

    const prefix = '{blue:[}{magenta:Holograph}{blue:] }';
    expect(logger.config.prefix).to.equal(prefix);

  });

});