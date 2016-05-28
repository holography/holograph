# Holograph (alpha)

> the study or production of holograms.

Holograph is a NPM module that parses comments in your CSS and turns them into a beautiful style guide. It is initially a port of the excellent work done by the [Hologram Ruby gem](https://trulia.github.io/hologram/) and aims to be compatible with most of its features.

In addition to features found in Hologram, Holograph includes:
* a responsive version of the [Hologram GitHub Template](https://github.com/wearecube/hologram-github-theme) with some minor alterations to content styles
* support for displaying multiple [colour palettes](#colour-palettes)

## Installation

Install the latest release from npm with (add --save or --save-dev to add the dependency to your project)

`npm install holograph`

## Configuration

Copy the template config into your project root

`cp node_modules/holograph/holograph_config.yml .`

The config file contains inline documentation for each entry, update it at this point to match your project.

## Usage

The binary takes no parameters and just reads all options from the config file

`node_modules/.bin/holograph`

The default build location is `./holograph/`. You can configure this by setting the `destination` value in `holograph_config.yml`.

### Documenting your styles

Holograph will scan for stylesheets (`.css`, `.scss`, `.sass`, `.less`, `.styl`) within the source directory defined in your configuration. It will find Holograph comments and generate style guide sections from your comment's settings and content.

Sample comment:

    /*doc
    ---
    title: Headings
    name: headings
    category: typography
    ---

    Headings should follow appropriate heading hierarchy.

    ```html_example
        <h1>Hello, world!</h1>
    ```
    */

_For more complete documentation, see [how to document your components](https://github.com/holography/holograph/wiki/How-to-document-your-components)._

### Colour palettes

Holograph allows creation of colour palettes from your proprocessor stylesheets (`.css`, `.scss`, `.sass`, `.less`, `.styl`). This feature is new for Holograph and is not found in Ruby Hologram.

In brief, to mark colour variables to include in Holograph, use the following comment syntax:

    $variable-name: <value>;    // hg-palette: Palette name

_For more complete documentation, see [how to use colour palettes](https://github.com/holography/holograph/wiki/How-to-use-colour-palettes)._

## How to test the software

## Known issues

### Incomplete features

* content and configuration for `index.html`
* `parent` option
* support for JavaScript content
* [referencing other components](https://github.com/trulia/hologram#referencing-other-components)

### Unsupported features
* colour values in palettes that require compilation, such as `darken($brand-primary, 10%)` and nested colour variables
* Ruby-specific: `.erb` as a source and 'slim' for templates

## Getting help

If you have questions, concerns, bug reports, etc, please file an issue in this repository's [issue tracker](https://github.com/holography/holograph/issues).

## Getting involved

1. Fork it
1. Create your feature/bug fix branch (git checkout -b my-new-feature)
1. Commit your changes (git commit -am 'Add some feature')
1. Push to the branch (git push origin my-new-feature)
1. Create new Pull Request

## More about the project

### Contributors
* [Ben Longden](https://twitter.com/blongden)
* [Laura Kishimoto](https://twitter.com/chicgeek)

### Open source licensing info
* [Terms](TERMS.md)
* [License](LICENSE)
* [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)

### Credits and references

* [Hologram](https://trulia.github.io/hologram/)
* Base theme css: [hologram-github-template](https://github.com/wearecube/hologram-github-theme)
* Syntax: [highlight.js](https://highlightjs.org/) using `github-gist` theme
