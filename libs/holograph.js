'use strict';
/*jslint node: true, stupid: true */

var fs = require('fs');
var mustache = require('mustache');
var yaml = require('js-yaml');
var colors = require('colors');
var marked = require('./markdown_renderer');
var init = require('./holograph_init');
var extend = require('extend');

function showError(message) {
    if (message) {
        console.log(message);
        console.log('Build failed (╯°□°）╯︵ ┻━┻)'.red);
        process.exit(1);
    }
}

function readFile(file) {
    try {
        var comment = fs.readFileSync(file, 'utf8');
    } catch(err) {
        showError(err.message);
    }
    return comment;
}

function extractPalette(source, config) {
    try {
        var template = fs.readFileSync(config.documentation_assets + '/_swatches.html', 'utf8');
    } catch (err) {
        return;
    }

    // fetch palettes
    var match;
    var palettes = {};
    var pattern = /^(.*?)[:=](.*?);?\s*\/\/\s*hg-palette:(.*?)$/mg;
    while ((match = pattern.exec(source)) !== null) {
        var paletteName = match[3].trim();
        var colourVariable = match[1].trim();
        var colourValue = match[2].trim();
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

function prepareCategories(results, config) {
    var doc = /\/\*doc\w*\n([\s\S]*?)\*\//mg;
    var pages = {};

    results.forEach(function(file) {
        var text = readFile(file);
        var matches = [];
        while (matches = doc.exec(text)) {
            var content = marked(matches[1]);
            if (!(pages.hasOwnProperty(content.meta.category))) {
                pages[content.meta.category] = [];
            }
            content.html += extractPalette(text, config);
            pages[content.meta.category].push(content);
        }
    });
    return pages;
}

function preparePageLinks(current, pages, index_title) {
    var links = [{
        link: 'index.html',
        title: index_title,
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
                        categories: preparePageLinks(category, pages, config.index_title),
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
                            categories: preparePageLinks('index', pages, config.index_title),
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

function holograph(config, callback) {
    init(config, function(err, results) {
        if(err) { callback(err); }
        processFiles(results, config, callback);
    });
}

function run() {
    var config = {
        index_title: 'Home'
    };

    fs.readFile('holograph_config.yml', 'utf8',
        function(err, data) {
            if (err) {
                if (err.code === 'ENOENT') {
                    showError('Could not find holograph_config.yml in the current directory.');
                }
            }

            holograph(extend(config, yaml.safeLoad(data)), function(err, result) {
                showError(err);
                console.log('Build successful \\o\/'.green);
            });
        }
    );
}

module.exports = {
    holograph: holograph,
    run: run,
    prepareCategories: prepareCategories
};
