# How to use colour palettes

Holograph allows creation of colour palettes from your stylesheets (`.css`, `.scss`, `.sass`, `.less`, `.styl`).

This feature is unique to Holograph and is not found in Ruby Hologram.

## Example output

![colour palette example](/docs/assets/example-palettes.png?raw=true "Colour palette example")

## Adding your palettes

Stylesheets that contain palettes can optionally contain the markdown and examples. As with other Holograph components, they can named and categorised. The palette content will appear below any other content in your documentation.

Palettes take your colour variable declarations and convert them to swatches in your style guide. Note: you will still need to include a Holograph comment block for this file.

To mark colour variables to include in Holograph, use the following comment syntax:

    /*doc
    ---
    title: Colours
    name: colours
    category: settings
    ---
    */

    $scss-variable: <value>;    // hg-palette: Palette name
    $sass-variable: <value>     // hg-palette: Palette name
    @less-variable: <value>;    // hg-palette: Palette name
    $stylus-variable = <value>  // hg-palette: Palette name

    $brand-primary: #3f8e7a;    // hg-palette: Brand
    $brand-secondary: #d4e05c;  // hg-palette: Brand

    $white: white;              // hg-palette: Monochrome
    $grey: #ccc;                // hg-palette: Monochrome
    $black: #000000;            // hg-palette: Monochrome

## Defining palettes in vanilla CSS

Vanilla CSS does not use variables and the above variable declaration syntax is not valid CSS. However, it may still be useful to have a palette reference.

This can be achieved by declaring your palettes in a new comment block. _Do not put this content in your main doc comment._

    /*palette
    black  : #000      // hg-palette: Vanilla
    grey   : #ccc      // hg-palette: Vanilla
    white  : #fff      // hg-palette: Vanilla
    */

## Additional information

* Colour values can be any valid CSS value. `white`, `#fff`, and `#ffffff` are all valid.
* Colour values that require compilation, such as `darken($brand-primary, 10%)` and nested colour variables, are not currently supported.
