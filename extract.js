var fs = require('fs');
var path = require('path');

var rules = {};
var dir = fs.readdirSync(path.join(__dirname, 'lib', 'rules'));
for (i = 0; i < dir.length; i++) {
  rules[dir[i].replace('.js', '')] = 'require(\'./' + path.join('./', 'rules', dir[i]) + '\')';
}

console.log(JSON.stringify(rules, null, 2).replace(/\"require/g, 'require').replace(/\)\",/g, '),'));
