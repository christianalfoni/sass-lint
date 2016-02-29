var sassLint = require('./index.js');

var text = [
  '$font-stack: Helvetica, sans-serif;',
  '$primary-color: #333;',
  '',
  'body {',
  '  color: $primary-color;',
  '  font: 100% $font-stack;',
  '}'
].join('\n');

console.log(sassLint.lintText({
  text: text,
  name: 'test.scss',
  format: 'scss'
}, {}, {}));
