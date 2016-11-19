'use strict';

// Module imports.
const chai = require('chai');
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const eazy = require('eazy-logger');
// SUT.
const logger = require('../../libs/utils/logger');

// Chai setup.
const expect = chai.expect;
chai.use(sinonChai);

describe('logger', function () {

  it('extends eazy-logger', function () {

    expect(logger).to.be.an.instanceof(eazy.Logger);

  });

  it('adds a custom prefix to log messages', function () {

    const prefix = '{blue:[}{magenta:Holograph}{blue:] }';
    expect(logger.config.prefix).to.equal(prefix);

  });

});