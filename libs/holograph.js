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

function prepareCategories(files, config) {
    var blocks = [];
    files.forEach(function(file) {
        blocks = blocks.concat(
            parseFile(file, config)
        );
    });

    blocks.sort(function(a,b) {
        return getOrder(a) - getOrder(b);
    })

    // create cats
    cats = buildCats(cats);

    // nest subcats under cats
    cats = nestCats(cats);



    return allSections;
}

function getOrder(block) {
    if (block.meta.order === undefined) {
        return Infinity;
    }
    return block.meta.order;
}

function buildCats(blocks) {
    var catList = {};
    blocks.forEach(function(block) {
        if (!(catList.hasOwnProperty(block.meta.category))) {
            catList[block.meta.category] = [];
        }
        catList[block.meta.category].push(block);
    })
    return catList;
}

function nestCats(catList) {
    catList.forEach(function(cat) {
        var subcatList = {};
        forEach.cat(function(subcat) {
            if (!(subcat.hasOwnProperty(block.meta.parent))) {
                catList[block.meta.parent] = [];
            }
            subcatList[block.meta.category].push(subcat);
        });
    });
}

function parseFile(file, config) {
    var doc = /\/\*doc\w*\n([\s\S]*?)\*\//mg;
    var blocks = [];
    var text = fs.readFileSync(file);
    var matches;
    while (matches = doc.exec(text)) {
        var content = marked(matches[1]);
        content.html += extractPalette(text, config);
        blocks.push(content);
    }
    return blocks;
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
                link: category.replace(/\s+/g, '').toLowerCase() + '.html',
                title: category,
                selected: category === current ? 'selected' : ''
            });
        }
    }

    return links;
}

function generatePage(config, page) {
    var blocks = [];
    var heading;
    var rawContent = fs.readFileSync(config.documentation_assets + '/_header.html', 'utf8');

    page.forEach(function (block) {
        heading = block.meta.parent ? 'h3' : 'h2';

        rawContent += '<' + heading + ' id="'+block.meta.name+'" class="styleguide">'+block.meta.title+'</' + heading + '>';
        rawContent += block.html;

        blocks.push({
            name: block.meta.name,
            title: block.meta.title,
            class: block.meta.parent ? 'child' : ''
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
        if(err) { return callback(err); }
        processFiles(results, config, callback);
    });
}


module.exports = {
    holograph: holograph,
    prepareCategories: prepareCategories
};
