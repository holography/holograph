var expect = require("chai").expect;
var fs = require("fs");
var mock = require("mock-fs");
var h = require("../");

describe("Holograph", function() {
    mock({
        'holograph': mock.directory({
            mode: '0700',
            uid: 1,
            gid: 1,
            items: {
                'index.html': "Hello, world!"
            }
        })
    });

    describe("Setup", function() {
        it("errs when the build destination cannot be removed", function(done) {
            h.holograph({ destination: "./holograph" }, function(err) {
                expect(err).to.be.an('error');
                expect(err.message).to.have.string('EACCES');
                done();
            });
        })
    });
});
