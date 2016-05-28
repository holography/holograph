'use strict';
/*jslint node: true, stupid: true */

var fs = require('fs');
var path = require('path');
var filterFiles = require('dive');
var rmdir = require('rimraf');
var ncp = require('ncp').ncp;
var mustache = require('mustache');
var marked = require('./markdown_renderer');
var yaml = require('js-yaml');
var colors = require('colors');

function extractComment(file) {
    var doc = /\/\*doc\n([\s\S]*?)\*\//m;
    var comment = fs.readFileSync(file, 'utf8').match(doc);
    return comment;
}

function extractPalette(file, config) {
    var source = fs.readFileSync(file, 'utf8');
    var template = fs.readFileSync(config.documentation_assets + '/_swatches.html', 'utf8');

    // fetch palettes
    var match;
    var palettes = {};
    var pattern = /^\s*(.*?)\s*[:=]\s*(.*)\s*;?\s*\/\/\s*hg-palette:\s*(.*?)\s*$/mg;
    while ((match = pattern.exec(source)) !== null) {
        var paletteName = match[3];
        var colourVariable = match[1];
        var colourValue = match[2];
        if (!palettes[paletteName]) {
            palettes[paletteName] = [];
        }
        palettes[paletteName].push({
            'name': colourVariable,
            'value': colourValue
        });
    }

    // convert to array
    var paletteList = [];
    for (var palette in palettes) {
        paletteList.push({
            'title': palette,
            'colours': palettes[palette]
        });
    };

    // create markup
    var content = mustache.render(template, {
        palettes: paletteList
    });
    return content;
}

function setupBuildDir(dir, assets, cb) {
    var ncpOptions = {
        filter: function(filePath) {
            var relPath = path.relative(assets, filePath);
            if (relPath == '') {
                return true;
            }
            var folder = relPath.split(path.sep)[0];
            return (folder == 'scripts' || folder == 'styles');
        }
    }

    rmdir(dir, function(err) {
        if (err) { throw err; }
        fs.mkdir(dir);
        ncp(assets, dir, ncpOptions, function(err) {
            if (err) { throw err; }
            cb();
        });
    });
}

function copyDependencies(dir, deps, cb) {
    var source = deps.shift();
    ncp(source, dir+'/'+path.basename(source), function(err) {
        if (err) { throw err; }
        if (deps.length) { copyDependencies(dir, deps, cb); }
        cb();
    });
}

function prepareCategories(results, config) {
    var pages = {};

    results.forEach(function(file) {
        var text = extractComment(file);
        if (text) {
            var content = marked(text[1]);

            if (!(pages.hasOwnProperty(content.meta.category))) {
                pages[content.meta.category] = [];
            }
            content.html += extractPalette(file, config);
            pages[content.meta.category].push(content);
        }
    });

    return pages;
}

function preparePageLinks(current, pages) {
    var links = [{
        link: 'index.html',
        title: 'Home',
        selected: current === 'index' ? 'selected' : ''
    }];
    var category;

    for (category in pages) {
        if (pages.hasOwnProperty(category)) {
            links.push({
                link: category + '.html',
                title: category,
                selected: category === current ? 'selected' : ''
            });
        }
    }

    return links;
}

function allowedExtension(config, file) {
    var defaultExtensions = ['.css', '.scss', '.less', '.sass', '.styl', '.js', '.md', '.markdown'];
    var extensions =  config.custom_extensions || defaultExtensions;

    return extensions.indexOf(path.extname(file)) !== -1;
}

function generatePage(config, page) {
    var blocks = [];
    var rawContent = fs.readFileSync(config.documentation_assets + '/_header.html', 'utf8');

    page.forEach(function (block) {
        rawContent += '<h1 id="'+block.meta.name+'" class="styleguide">'+block.meta.title+'</h1>';
        rawContent += block.html;

        blocks.push({
            name: block.meta.name,
            title: block.meta.title
        });
    });

    rawContent += fs.readFileSync(config.documentation_assets +'/_footer.html', 'utf8');

    return {
        content: rawContent,
        blocks: blocks
    }
}

function processFiles(results, config, cb) {
    var pages = prepareCategories(results, config);
    var category, content;

    for (category in pages) {
        if (pages.hasOwnProperty(category)) {
            content = generatePage(config, pages[category])
            fs.writeFile(
                config.destination + '/' + category + '.html',
                mustache.render(
                    content.content,
                    {
                        title: category,
                        config: config,
                        categories: preparePageLinks(category, pages),
                        blocks: content.blocks
                    }
                )
            );

            if (category === config.index) {
                fs.writeFile(
                    config.destination + '/index.html',
                    mustache.render(
                        content.content,
                        {
                            title: 'index',
                            config: config,
                            categories: preparePageLinks('index', pages),
                            blocks: content.blocks
                        }
                    )
                )
            }
        }
    }

    if (cb) cb();
}

function maybeThrowError(err) {
    if (err) { throw err; }
}

function holograph(config, cb) {
    var results = [];
    setupBuildDir(config.destination, config.documentation_assets, function() {
        copyDependencies(config.destination, config.dependencies, function() {
            filterFiles(config.source, function (err, file) {
                if (err) {
                    maybeThrowError(err);
                } else {
                    if (allowedExtension(config, file)) {
                        results.push(file);
                    }
                }
            }, function() {
                processFiles(results, config, cb);
            });
        });
    });
}

function showError(e) {
    console.log(e.message);
    console.log('Build failed (╯°□°）╯︵ ┻━┻)'.red);
    process.exit(1);
}

function run() {
    fs.readFile('holograph_config.yml', 'utf8',
        function(err, data) {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.log('Could not load config file.');
                }
                showError(err);
            }

            holograph(yaml.safeLoad(data), function() {
                console.log('Build successful \\o\/'.green);
            });
        }
    );
}

module.exports = {
    holograph: holograph,
    run: run
};
