var expect = require("chai").expect;
var fs = require("fs");
var mock = require("mock-fs");
var init = require("../libs/holograph_init");

describe("Holograph", function() {
    describe("Initialise", function() {
        mock({
            'noaccess': mock.directory({
                mode: '0700',
                uid: 1,
                gid: 1,
                items: {
                    'index.html': "Hello, world!"
                }
            }),
            'src': mock.directory({
                items: {
                    'main.scss': "h1 { color: red; }"
                }
            })
        });

        it("errs when the build destination cannot be removed", function(done) {
            init({ destination: "./noaccess" }, function(err) {
                expect(err).to.be.an('error');
                expect(err.message).to.have.string('EACCES');
                done();
            });
        });

        it("creates a new build directory", function(done) {
            init({ destination: "./hologram", source: "./src" }, function(err) {
                expect(err).to.be.null;
                fs.lstat('./hologram', function(err, stats) {
                    expect(err).to.be.null;
                    expect(stats.isDirectory()).to.be.true;
                    done();
                })
            });
        });

        it("errs when the source directory does not exist", function() {
            init({ destination: "./hologram", source: "./dshd" }, function(err) {
                expect(err).to.be.an('error');
                expect(err.message).to.have.string('ENOENT');
            });
        });
    });
});
