'use strict';
/*jslint node: true, stupid: true */

var fs = require('fs');
var mustache = require('mustache');
var colors = require('colors');
var marked = require('./markdown_renderer');
var init = require('./holograph_init');

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
        var text = fs.readFileSync(file);
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

function preparePageLinks(current, pages, config) {
    var links = [{
        link: 'index.html',
        title: config.index_title,
        selected: current === 'index' ? 'selected' : ''
    }];
    var category;

    for (category in pages) {
        if (pages.hasOwnProperty(category)) {
            if (category != config.index) {
                links.push({
                    link: categoryLink(category),
                    title: category,
                    selected: category === current ? 'selected' : ''
                });
            }
        }
    }

    return links;
}

function headerFooter(config, content) {
    var rawContent = fs.readFileSync(config.documentation_assets + '/_header.html', 'utf8');
    rawContent += content;
    rawContent += fs.readFileSync(config.documentation_assets +'/_footer.html', 'utf8');
    return rawContent;
}

function generatePage(config, page) {
    var blocks = [];
    var rawContent = "";

    page.forEach(function (block) {
        rawContent += '<h1 id="'+block.meta.name+'" class="styleguide">'+block.meta.title+'</h1>';
        rawContent += block.html;

        blocks.push({
            name: block.meta.name,
            title: block.meta.title
        });
    });


    return {
        content: headerFooter(config, rawContent),
        blocks: blocks
    }
}

function processFiles(results, config, cb) {
    var pages = prepareCategories(results, config);
    var category, content;

    for (category in pages) {
        var page = category === config.index ? 'index' : category;
        if (pages.hasOwnProperty(category)) {
            content = generatePage(config, pages[category])
            fs.writeFile(
                config.destination + '/' + categoryLink(page),
                mustache.render(
                    content.content,
                    {
                        title: page,
                        config: config,
                        categories: preparePageLinks(page, pages, config),
                        blocks: content.blocks
                    }
                )
            );
        }
    }

    if (!config.index) {
        fs.stat(config.source + '/index.md', function(err, stats) {
            if (!err) {
                fs.readFile(config.source + '/index.md', 'utf8', function(err, content) {
                    fs.writeFile(
                        config.destination + '/index.html',
                        mustache.render(
                            headerFooter(config, marked(content).html),
                            {
                                title: 'index',
                                config: config,
                                categories: preparePageLinks('index', pages, config)
                            }
                        )
                    )
                });
            }
        });
    }

    if (cb) cb();
}

function categoryLink(category) {
    return category.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase() + '.html'
}

function maybeThrowError(err) {
    if (err) { throw err; }
}

function holograph(config, callback) {
    init(config, function(err, results) {
        if(err) { return callback(err); }
        processFiles(results, config, callback);
    });
}


module.exports = {
    holograph: holograph,
    prepareCategories: prepareCategories
};
