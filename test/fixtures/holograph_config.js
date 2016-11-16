module.exports = {
  source: './scss',
  destination: './holograph',
  documentation_assets: './node_modules/holograph/assets',
  dependencies: [
    'css'
  ],
  css_include: [
    'css/example.css'
  ],
  index: 'basics',
  exit_on_warnings: false,
  global_title: 'Holograph stylesheet - JavaScript'
}