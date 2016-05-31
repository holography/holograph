'use strict';
var fs = require('fs');
var rmdir = require('rimraf');
var ncp = require('ncp').ncp;
var path = require('path');
var filterFiles = require('dive');


function setupBuildDir(dir, assets, callback) {
    rmdir(dir, function(err) {
        if (err) {
            callback(new Error(err.message));
        }

        fs.mkdir(dir, function(err) {
            if (err) {
                callback(new Error(err.message));
            }

            if (assets) {
                ncp(assets, dir, function(err) {
                    if (err && err.code === 'ENOENT') {
                        callback(new Error('Couldn\'t find a directory, most likely ' + assets + ' is missing.'));
                    }

                    callback();
                });
            } else {
                callback();
            }
        });
    });
}

function copyDependencies(dir, deps, cb) {
    if (deps && deps.length) {
        var source = deps.shift();
        ncp(source, dir + '/' + path.basename(source), function(err) {
            if (err) { showError(err.message) }
            copyDependencies(dir, deps, cb);
        });
    } else {
        cb();
    }
}

function allowedExtension(config, file) {
    var defaultExtensions = ['.css', '.scss', '.less', '.sass', '.styl', '.js', '.md', '.markdown'];
    var extensions =  config.custom_extensions || defaultExtensions;

    return extensions.indexOf(path.extname(file)) !== -1;
}

module.exports = function(config, callback) {
    var results = [];
    setupBuildDir(config.destination, config.documentation_assets, function(err) {
        if (err) {
            callback(new Error(err.message));
            return;
        }

        copyDependencies(config.destination, config.dependencies, function(err) {
            if (err) {
                callback(new Error(err.message));
                return;
            }

            filterFiles(config.source, function (err, file) {
                if (err) {
                    callback(new Error(err.message));
                    return;
                }

                if (allowedExtension(config, file)) {
                    results.push(file);
                }
            }, function() {
                callback(null, results);
            });
        });
    });
};
