'use strict';
/*jslint node: true, stupid: true */

var marked = require('meta-marked');
var fs = require('fs');
var yaml = require('js-yaml');
var search = require('recursive-search');
var rmdir = require('rimraf');
var ncp = require('ncp').ncp;
var mustache = require('mustache');
var config = yaml.safeLoad(fs.readFileSync('hologram_config.yml', 'utf8'));

marked.Renderer.prototype.code = function (code, lang) {
    return this.options.highlight(code, lang);
};

function escape(html, encode) {
    return html
        .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function parseMarkdown(text) {
    return marked(text, {
        highlight: function (code, lang) {
            var content = "";
            if (lang === 'html_example') {
                content = '<div class="codeExample"><div class="exampleOutput">' + 
                    code +
                    '</div><div class="codeBlock"><div class="highlight"><pre>' +
                    escape(code, true) +
                    '</pre></div></div></div>';
            } else {
                content = '<pre><code>'+escape(code, true)+'</code></pre>';
            }
            return content; // require('highlight.js').highlightAuto(content).value;
        }
    });
}

function extractComment(file) {
    var doc = /\/\*doc\n([\s\S]*)\*\//m;
    var comment = fs.readFileSync(file, 'utf8').match(doc)
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

function processFiles(results) {
    var pages = prepareCategories(results);
    var links = preparePageLinks(pages);
    var category;

    for (category in pages) {
        if (pages.hasOwnProperty(category)) {
            var blocks = [];
            var rawContent = fs.readFileSync(config.documentation_assets+'/_header.html', 'utf8');

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

setupBuildDir(config.destination, config.documentation_assets, function() {
    copyDependencies(config.destination, config.dependencies, function() {
        search.recursiveSearch(/.scss$/, config.source, maybeThrowError, processFiles);
    });
});
