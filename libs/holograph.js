'use strict';
/*jslint node: true, stupid: true */

var fs = require('fs');
var search = require('recursive-search');
var rmdir = require('rimraf');
var ncp = require('ncp').ncp;
var mustache = require('mustache');
var marked = require('./markdown_renderer');

function extractComment(file) {
    var doc = /\/\*doc\n([\s\S]*?)\*\//m;
    var comment = fs.readFileSync(file, 'utf8').match(doc);
    return comment;
}

function extractPalette(file) {
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
    rmdir(dir, function() {
        fs.mkdir(dir);
        ncp(assets, dir, function(err) {
            if (err) { throw err; }
            cb();
        });
    });
}

function copyDependencies(dir, deps, cb) {
    var path = require('path');
    var source = deps.shift();
    ncp(source, dir+'/'+path.basename(source), function(err) {
        if (err) { throw err; }
        if (deps.length) { copyDependencies(dir, deps, cb); }
        cb();
    });
}

function prepareCategories(results) {
    var pages = {};

    results.forEach(function(file) {
        var text = extractComment(file);
        if (text) {
            var content = marked(text[1]);

            if (!(pages.hasOwnProperty(content.meta.category))) {
                pages[content.meta.category] = [];
            }
            content.html += extractPalette(file);
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

function processFiles(results, config) {
    var pages = prepareCategories(results);
    var category;

    for (category in pages) {
        if (pages.hasOwnProperty(category)) {
            var blocks = [];
            var rawContent = fs.readFileSync(config.documentation_assets + '/_header.html', 'utf8');

            pages[category].forEach(function (block) {
                rawContent += '<h1 id="'+block.meta.name+'" class="styleguide">'+block.meta.title+'</h1>';
                rawContent += block.html;

                blocks.push({
                    name: block.meta.name,
                    title: block.meta.title
                });
            });

            rawContent += fs.readFileSync(config.documentation_assets +'/_footer.html', 'utf8');

            var content = mustache.render(
                rawContent,
                {
                    title: category,
                    config: config,
                    categories: preparePageLinks(category, pages),
                    blocks: blocks
                }
            );

            fs.writeFile(config.destination + '/' + category + '.html', content);

            if (category === config.index) {
                content = mustache.render(
                    rawContent,
                    {
                        title: 'index',
                        config: config,
                        categories: preparePageLinks('index', pages),
                        blocks: blocks
                    }
                );
                fs.writeFile(config.destination + '/index.html', content);
            }

        }
    }
}

function maybeThrowError(err) {
    if (err) { throw err; }
}

function holograph(config) {
    setupBuildDir(config.destination, config.documentation_assets, function() {
        copyDependencies(config.destination, config.dependencies, function() {
            search.recursiveSearch(/.scss$/, config.source, maybeThrowError, function(results) {
                processFiles(results, config);
            });
        });
    });
}

module.exports = holograph;
