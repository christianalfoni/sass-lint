'use strict';

var helpers = require('../helpers'),
    cssColors = require('../../data/literals.js');

module.exports = {
  'name': 'no-color-keywords',
  'defaults': {},
  'detect': function (ast, parser) {
    var result = [];

    ast.traverseByType('value', function (node) {
      node.traverse(function (elem, i, parent) {
        var isVariable = false;

        if (parent) {
          if (parent.type === 'variable') {
            isVariable = true;
          }
        }

        if (elem.type === 'ident' && !isVariable) {
          var index = cssColors.indexOf(elem.content.toLowerCase());

          if (index !== -1) {
            result = helpers.addUnique(result, {
              'ruleId': parser.rule.name,
              'line': elem.start.line,
              'column': elem.start.column,
              'message': 'Color \'' + elem.content + '\' should be written in its hexadecimal form #' + cssColors[index + 1],
              'severity': parser.severity
            });
          }
        }
      });

    });
    return result;
  }
};
