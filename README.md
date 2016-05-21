# Holograph

Holograph is a NPM module that parses comments in your CSS and turns them into a beautiful styleguide. It is initially a port of the excellent work done by the hologram ruby gem and aims to be compatible with most of its features.

  - **Technology stack**: node.js, css, html, javascript
  - **Status**:  Alpha.

## Installation

## Configuration

## Usage

### Colour palettes

Holograph allows creation of colour palettes, a feature not found in Ruby Hologram. The source file with your palettes must contain a comment with the usual meta information required for Holograph.

To mark colours to include in Holograph, use the following syntax with your palette names:

    $variable-name: <value>;    // hg-palette: My palette name

    $brand-primary: #3f8e7a;    // hg-palette: Brand
    $brand-secondary: #d4e05c;  // hg-palette: Brand

    $white: white;              // hg-palette: Monochrome
    $grey: #ccc;                // hg-palette: Monochrome
    $black: #000000;            // hg-palette: Monochrome

**Note**: This feature does not support colour values that require compilation, such as `darken($brand-primary, 10%)` or nested colour variables.

## How to test the software

## Known issues

## Getting help

If you have questions, concerns, bug reports, etc, please file an issue in this repository's Issue Tracker.

## Getting involved

----

## Open source licensing info
1. [TERMS](TERMS.md)
2. [LICENSE](LICENSE)
3. [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)

----

# Contributors
1. [Ben Longden](https://twitter.com/blongden)
2. [Laura Kishimoto](https://twitter.com/chicgeek)

----

## Credits and references

1. [hologram](https://trulia.github.io/hologram/)
2. [hologram-github-template](https://github.com/wearecube/hologram-github-theme)
