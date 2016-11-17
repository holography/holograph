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

  describe('locator', function () {

    let loader;

    afterEach(function () {
      mock.restore();
      loader = {};
    });

    it('can locate YAML config files', function () {

      mock({
        'holograph_config.yml': YAMLConfigFixture
      });

      loader = new configLoader();

      expect(loader.getConfigExtension()).to.equal('yml');

    })

    it('can locate JS config files', function () {

      mock({
        'holograph_config.js': JSConfigFixture
      });

      loader = new configLoader();

      expect(loader.getConfigExtension()).to.equal('js');

    });

    it('prefers JS files over YAML files', function () {

      mock({
        'holograph_config.yml': YAMLConfigFixture,
        'holograph_config.js': JSConfigFixture
      });

      loader = new configLoader();

      expect(loader.getConfigExtension()).to.equal('js');

    });

  });

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

  });


});