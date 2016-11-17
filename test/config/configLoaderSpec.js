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
  './holograph_config': require('../fixtures/holograph_config.js')
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

      // const stubbedJSConfig = proxyquire('./holograph_config', {foo: 'bar'}).noCallThru();

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

  });


});