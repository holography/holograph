# Holograph

Holograph is a NPM module that parses comments in your CSS and turns them into a beautiful style guide. It is initially a port of the excellent work done by the [Hologram Ruby gem](https://trulia.github.io/hologram/) and aims to be compatible with most of its features.

  - **Technology stack**: Node.js, CSS, HTML, JavaScript
  - **Status**: alpha

## Installation

## Configuration

## Usage

### Colour palettes

Holograph allows creation of colour palettes from sources written in SCSS, SASS, LESS, or Stylus. This feature is not found in Ruby Hologram.

The source file must contain a comment with the usual meta information (title, category, etc) required for Holograph. To mark colour variables to include in Holograph, use the following syntax:

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
