# Holograph (alpha)

Holograph is a NPM module that parses comments in your CSS and turns them into a beautiful style guide. It is initially a port of the excellent work done by the [Hologram Ruby gem](https://trulia.github.io/hologram/) and aims to be compatible with most of its features.

In addition to features found in Hologram, Holograph includes:
* a responsive version of the [Hologram GitHub Template](https://github.com/wearecube/hologram-github-theme) with some minor alterations to content styles
* support for displaying multiple [colour palettes](#colour-palettes)

## Installation

## Configuration

## Usage

### Documenting your styles

Holograph will scan for stylesheets (`.css`, `.scss`, `.sass`, `.less`, `.styl`) within the source directory defined in your configuration. It will find holograph comments and generate style guide sections from your comment's settings and content.

For more information and syntax, see [documenting your styles and components](https://github.com/trulia/hologram#documenting-your-styles-and-components) in the Hologram repo.

### Colour palettes

Holograph allows creation of colour palettes from your proprocessor stylesheets (`.scss`, `.sass`, `.less`, `.styl`). This feature is new for Holograph and is not found in Ruby Hologram.

The source file must contain a comment with the usual meta information (`title`, `category`, etc) required for Holograph. To mark colour variables to include in Holograph, use the following syntax:

    $scss-variable: <value>;    // hg-palette: Palette name
    $sass-variable: <value>     // hg-palette: Palette name
    @less-variable: <value>;    // hg-palette: Palette name
    $stylus-variable = <value>  // hg-palette: Palette name

    $brand-primary: #3f8e7a;    // hg-palette: Brand
    $brand-secondary: #d4e05c;  // hg-palette: Brand

    $white: white;              // hg-palette: Monochrome
    $grey: #ccc;                // hg-palette: Monochrome
    $black: #000000;            // hg-palette: Monochrome

**Note**: This feature does not support colour values that require compilation, such as `darken($brand-primary, 10%)` and nested colour variables.

![colour palettes](docs/example-palettes.png?raw=true)

## How to test the software

## Known issues

### Incomplete features

* content and configuration for `index.html`
* `parent` option
* support for JavaScript content
* [referencing other components](https://github.com/trulia/hologram#referencing-other-components)

### Features not in scope
* support for colour values in palettes that require compilation, such as `darken($brand-primary, 10%)` and nested colour variables.

## Getting help

If you have questions, concerns, bug reports, etc, please file an issue in this repository's [issue tracker](https://github.com/blongden/holograph/issues).

## Getting involved

## More about the project

### Contributors
* [Ben Longden](https://twitter.com/blongden)
* [Laura Kishimoto](https://twitter.com/chicgeek)

### Open source licensing info
* [Terms](TERMS.md)
* [License](LICENSE)
* [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)

### Credits and references

* [hologram](https://trulia.github.io/hologram/)
* [hologram-github-template](https://github.com/wearecube/hologram-github-theme)
