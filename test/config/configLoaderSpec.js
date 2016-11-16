'use strict';

// Module imports.
const configLoader = require('../../libs/config/configLoader');
const expect = require('chai').expect;
const mock = require('mock-fs');
const fs = require('fs');

// Fixture imports.
const YAMLConfigFixture = fs.readFileSync('test/fixtures/holograph_config.yml');
const JSConfigFixture = require('../fixtures/holograph_config');

describe('configLoader', function () {

  describe('location', function () {

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

  // describe('loading', function () {

  //   let loader;

  //   afterEach(function () {
  //     mock.restore();
  //     loader = {};
  //   });

    // it('can load YAML config', function () {

    //   mock({
    //     'holograph_config.yml': YAMLConfigFixture
    //   });

    //   loader = new configLoader();
    //   config = loader.load();

    //   expect(config.global_title).to.equal('Holograph stylesheet - YAML');

    // });

    // it('can load JS config', function () {

    //   mock({
    //     'holograph_config.js': JSConfigFixture
    //   });

    //   expect(config.global_title).to.equal('Holograph stylesheet - JavaScript');

    // });

  // });


});