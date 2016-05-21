var marked = require('meta-marked');
var Renderer = new marked.Renderer();

Renderer.list = function(body, ordered) {
    var type = ordered ? 'ol' : 'ul';
    return '<' + type + ' class="styleguide">\n' + body + '</' + type + '>\n';
};

Renderer.table = function(header, body) {
      return '<table class="styleguide">\n'
          + '<thead>\n'
          + header
          + '</thead>\n'
          + '<tbody>\n'
          + body
          + '</tbody>\n'
          + '</table>\n';
};

Renderer.blockquote = function(quote) {
      return '<blockquote class="styleguide">\n' + quote + '</blockquote>\n';
};

Renderer.heading = function(text, level, raw) {
      return '<h'
          + level
          + ' id="'
          + this.options.headerPrefix
          + raw.toLowerCase().replace(/[^\w]+/g, '-')
          + '" class="styleguide">'
          + text
          + '</h'
          + level
          + '>\n';
};

Renderer.paragraph = function(text) {
      return '<p class="styleguide">' + text + '</p>\n';
};

Renderer.codespan = function(text) {
      return '<code class="styleguide">' + text + '</code>';
};

Renderer.code = function (code, lang) {
    var hl = require('highlight.js');
    var content = "";
    lang = lang || "html";

    function renderCode(code, lang) {
        return '<pre class="styleguide"><code>' + hl.highlight(lang, code).value + '</code></pre>';
    }

    if (lang === 'html_example') {
        content = '<div class="codeExample">' +
            '<div class="exampleOutput">' + code + '</div>' +
            '<div class="codeBlock">' + renderCode(code, 'html') + '</div>' +
            '</div>';
    } else {
        content = renderCode(code, lang);
    }
    return content;
};

marked.setOptions({ renderer: Renderer });

module.exports = marked;
