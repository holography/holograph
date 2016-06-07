# How to document your components

Holograph relies on comments in your source files to define and document your components.

These files can be any extension as determined by your Holograph configuration; by default, Holograph will check for documentation in `.css`, `.scss`, `.less`, `.sass`, `.styl`, `.js`, `.md`, and `.markdown` files in your source directory.

## An example

### Comment in your source file

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

### Result
![typography component example](/docs/assets/example-typography.png?raw=true "Typography component example")

## Comment format

Comments for use with Holograph must begin with `/*doc`. Only the first comment per file is used.

The comments define your component and where it displays in your style guide, as well as any other content and examples to display. The example above uses YAML data, markdown, and an HTML example.

### YAML data
* `title`: **Required**. The title of your component, displayed as a heading in the style guide.
* `name`: **Required**. Used for grouping components. By assigning a name, a component can be referenced in another component as a parent. *Note: items in the same category are sorted alphabetically by name.*
* `category`: Only required if a `parent` is not set. This is the broad categories for the component: all components in the same category will be written to the same page. It can be set to either a string or a YAML array. If you use an array, the component will be written to all pages in the array.

For more information, see the [Hologram documentation on this section](https://github.com/trulia/hologram#document-yaml-section).

### Markdown
Good old regular markdown. Holograph uses [meta-marked](https://www.npmjs.com/package/meta-marked) to parse markdown from comments.

### Examples
Examples are marked with a type. Generally, examples will use `html_example`. Support for other and custom types will be added to Holograph at a later date.

## Putting examples in markup tables
Holograph also allows HTML examples within markup. This can be useful for small elements with variations, such as buttons.

Here is a markdown table with the elements to display in one column and a reference of required classes in another:

```
Button                                              | Class
--------------------------------------------------- | -----------------
<button class="button">default</button>             | `button`
<button class="button primary">primary</button>     | `button primary`
<button class="button secondary">secondary</button> | `button secondary`
```

This will display as follows:
![examples in a markdown table](/docs/assets/example-markdown-table.png?raw=true "Examples in a markdown table")

## Also see
For more information and syntax for these comments, see [documenting your styles and components](https://github.com/trulia/hologram#documenting-your-styles-and-components) in the Hologram repo.
