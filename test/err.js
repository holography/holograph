var expect = require('chai').expect;
var fs = require('fs');
var mock = require('mock-fs');
var init = require('../libs/holograph_init');

describe('Holograph', function() {
    describe('Setup Build Directory', function() {
        beforeEach(function() {
            mock({
                'noaccess': mock.directory({
                    mode: '0700',
                    uid: 1,
                    gid: 1,
                    items: {
                        'index.html': 'Hello, world!'
                    }
                }),
                'src': mock.directory({
                    items: {
                        'main.scss': 'h1 { color: red; }'
                    }
                }),
                'assets': mock.directory({
                    items: {
                        'style.css': 'h1 { color: blue; }',
                        '_header.html': '<h1>header</h1>',
                        '_footer.html': '<h2>footer</h2>'
                    }
                })
            });
        });

        afterEach(mock.restore);

        it('errs when the build destination cannot be removed', function(done) {
            init({ destination: './noaccess' }, function(err) {
                expect(err).to.be.an('error');
                expect(err.message).to.have.string('EACCES');
                done();
            });
        });

        it('creates a new build directory', function(done) {
            init({ destination: './hologram', source: './src' }, function(err) {
                expect(err).to.be.null;
                fs.lstat('./hologram', function(err, stats) {
                    expect(err).to.be.null;
                    expect(stats.isDirectory()).to.be.true;
                    done();
                })
            });
        });

        it('errs when the source directory does not exist', function(done) {
            init({ destination: './hologram', source: './foo' }, function(err) {
                expect(err).to.be.an('error');
                expect(err.message).to.have.string('ENOENT');
                done();
            });
        });

        it('errs when the documentation_assets directory does not exist', function(done) {
            init({ destination: './hologram', source: './src', documentation_assets: './foo'}, function(err) {
                expect(err).to.be.an('error');
                done();
            });
        });

        it('copies the documentation_assets into the destination', function(done) {
            init({ destination: './hologram', source: './src', documentation_assets: './assets'}, function(err) {
                expect(err).to.be.null;
                fs.lstat('./hologram/style.css', function(err, stats) {
                    expect(err).to.be.null;
                    expect(stats.isFile()).to.be.true;
                    done();
                });
            });
        });

        it('does not copy partials from documentation_assets into the destination', function(done) {
            init({ destination: './hologram', source: './src', documentation_assets: './assets'}, function(err) {
                expect(err).to.be.null;
                fs.lstat('./hologram/_header.html', function(err, stats) {
                    expect(err.code).to.be.string('ENOENT');
                    done();
                });
            });
        });
    });
});
