'use strict';
/*jslint node: true, stupid: true */

var fs = require('fs');
var search = require('recursive-search');
var rmdir = require('rimraf');
var ncp = require('ncp').ncp;
var mustache = require('mustache');
var marked = require('./markdown_renderer');

function parseMarkdown(text) {
    return marked(text);
}

function extractComment(file) {
    var doc = /\/\*doc\n([\s\S]*?)\*\//m;
    var comment = fs.readFileSync(file, 'utf8').match(doc);
    return comment;
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
            var parsed = parseMarkdown(text[1]);

            if (!(pages.hasOwnProperty(parsed.meta.category))) { pages[parsed.meta.category] = []; }
            pages[parsed.meta.category].push(parsed);
        }
    });

    return pages;
}

function preparePageLinks(pages) {
    var links = [];
    var category;

    for (category in pages) {
        if (pages.hasOwnProperty(category)) {
            links.push({
                link: category + '.html',
                title: category
            });
        }
    }

    return links;
}

function processFiles(results, config) {
    var pages = prepareCategories(results);
    var links = preparePageLinks(pages);
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
                    categories: links,
                    blocks: blocks
                }
            );

            fs.writeFile(config.destination + '/' + category + '.html', content);
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
