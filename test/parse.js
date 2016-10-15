var expect = require('chai').expect;
var fs = require('fs');
var mock = require('mock-fs');
var holo = require('../libs/holograph');

describe('Holograph', function() {
    beforeEach(function() {
        mock({
            'src': mock.directory({
                items: {
                    'main.scss': "/*doc\n---\ncategory: test\n---\n# one\n*/\n/*doc\n---\ncategory: test\n---\n# two\n*/\n"
                }
            })
        });
    });

    afterEach(mock.restore);

    describe('source parser', function() {

        it('parses multiple doc comments', function() {
            var result = holo.prepareCategories(['src/main.scss'], []);
            expect(result.test).to.have.lengthOf(2);
        });
    });
});
