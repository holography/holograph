'use strict';

// Module imports.
const expect = require('chai').expect;
const mock = require('mock-fs');
const fs = require('fs');
const proxyquire = require('proxyquire').noCallThru();

// Fixture imports.
const YAMLConfigFixture = fs.readFileSync('test/fixtures/holograph_config.yml');
const JSConfigFixture = require('../fixtures/holograph_config');

// SUT.
const configLoader = proxyquire('../../libs/config/configLoader', {
  './holograph_config': require('../fixtures/holograph_config.js'),
  './defaultConfig': {
    'test_config': 'I am a serious expectation.'
  }
});

describe('configLoader', function () {

  describe('loading', function () {

    let loader;
    let config;

    afterEach(function () {
      mock.restore();
      loader = {};
      config = {};
    });

    it('can load YAML config', function () {

      mock({
        'holograph_config.yml': YAMLConfigFixture
      });

      loader = new configLoader();
      config = loader.load();

      expect(config.global_title).to.equal('Holograph stylesheet - YAML');

    });

    it('can load JS config', function () {

      mock({
        'holograph_config.js': fs.readFileSync('test/fixtures/holograph_config.js').toString()
      });

      loader = new configLoader();
      config = loader.load();

      expect(config.global_title).to.equal('Holograph stylesheet - JavaScript');

    });

    it('prefers JS config over YAML config', function () {

      mock({
        'holograph_config.yml': YAMLConfigFixture,
        'holograph_config.js': JSConfigFixture
      });

      loader = new configLoader();
      config = loader.load();

      expect(config.global_title).to.equal('Holograph stylesheet - JavaScript');

    });

    it('throws an error if no config was found', function () {

      mock({
        'dummy.txt': 'I am a dummy file.'
      });

      loader = new configLoader();

      // This has to be in a callable for some reason, as Chai fails miserably then you just pass loader.load to
      // expect()
      const loaderFunc = function () {
        loader.load();
      }

      expect(loaderFunc).to.throw(Error, 'No holograph configuration file found.');

    });

    it('merges loaded config with defaults', function () {

      mock({
        'holograph_config.js': JSConfigFixture
      });

      loader = new configLoader();
      config = loader.load();

      expect(config.test_config).to.equal('I am a serious expectation.');

    });

  });

});