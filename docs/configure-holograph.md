# How to configure Holograph

Settings for your Holograph instance are found in either `holograph_config.js` or `holograph_config.yml`.

Holograph will run from same directory where the config file resides: all paths should be relative to that location.

## Required settings
* **`global_title`**: Title for your Holograph instance. Appears at the top of your style guide. String.
* **`source`**: The relative path(s) to your source files (usually uncompiled files). Accepts either a single value or an array.
* **`destination`**: The relative path to the destination where Holograph will be built.
* **`documentation_assets`**: The relative path to Holograph-specific assets (styles and scripts) relative to your config file. Usually `./node_modules/holograph/assets`.
* **`dependencies`**: A list of relative paths to the compiled CSS and JS that you are documenting. These files will be copied over into the documentation output directory. List.
* **`css_include`**: A list of relative paths to the compiled CSS and JS that you are documenting. These files will be copied over into the documentation output directory and included as a stylesheet on your styleguide. List.

## Optional settings
* **`index`**: The name of the category to set as the index.html of your style guide. String.
* **`index_title`**: A custom name for the index page, defaults to "Home".
* **`custom_extensions`**: List of file extensions to include for files in your source directory. Accepts either a single value or an array. Defaults to `.css`, `.scss`, `.less`, `.sass`, `.styl`, `.js`, `.md`, and `.markdown`.

## Not yet implemented

These settings are found in Hologram but have not yet been implemented in Holograph:

* `code_example_templates`
* `code_example_renderers`
* `custom_markdown`
* `exit_on_warnings`: Set to true if Holograph should exit on errors (eg. if a referenced file isn't found). Default is false. Boolean.
* `ignore_paths`
* `nav_level`: Sets the level of section navigation desired. String: `all` or `section`.
 * `all`: show sub navigation for all sections.
 * `section`: show sub navigation in top level sections only.
