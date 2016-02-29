'use strict';

var merge = require('merge');
var rules = {
  "bem-depth": require('./rules/bem-depth.js'),
  "border-zero": require('./rules/border-zero.js'),
  "brace-style": require('./rules/brace-style.js'),
  "class-name-format": require('./rules/class-name-format.js'),
  "clean-import-paths": require('./rules/clean-import-paths.js'),
  "empty-args": require('./rules/empty-args.js'),
  "empty-line-between-blocks": require('./rules/empty-line-between-blocks.js'),
  "extends-before-declarations": require('./rules/extends-before-declarations.js'),
  "extends-before-mixins": require('./rules/extends-before-mixins.js'),
  "final-newline": require('./rules/final-newline.js'),
  "force-attribute-nesting": require('./rules/force-attribute-nesting.js'),
  "force-element-nesting": require('./rules/force-element-nesting.js'),
  "force-pseudo-nesting": require('./rules/force-pseudo-nesting.js'),
  "function-name-format": require('./rules/function-name-format.js'),
  "hex-length": require('./rules/hex-length.js'),
  "hex-notation": require('./rules/hex-notation.js'),
  "id-name-format": require('./rules/id-name-format.js'),
  "indentation": require('./rules/indentation.js'),
  "leading-zero": require('./rules/leading-zero.js'),
  "mixin-name-format": require('./rules/mixin-name-format.js'),
  "mixins-before-declarations": require('./rules/mixins-before-declarations.js'),
  "nesting-depth": require('./rules/nesting-depth.js'),
  "no-color-keywords": require('./rules/no-color-keywords.js'),
  "no-color-literals": require('./rules/no-color-literals.js'),
  "no-css-comments": require('./rules/no-css-comments.js'),
  "no-debug": require('./rules/no-debug.js'),
  "no-duplicate-properties": require('./rules/no-duplicate-properties.js'),
  "no-empty-rulesets": require('./rules/no-empty-rulesets.js'),
  "no-extends": require('./rules/no-extends.js'),
  "no-ids": require('./rules/no-ids.js'),
  "no-important": require('./rules/no-important.js'),
  "no-invalid-hex": require('./rules/no-invalid-hex.js'),
  "no-mergeable-selectors": require('./rules/no-mergeable-selectors.js'),
  "no-misspelled-properties": require('./rules/no-misspelled-properties.js'),
  "no-qualifying-elements": require('./rules/no-qualifying-elements.js'),
  "no-trailing-zero": require('./rules/no-trailing-zero.js'),
  "no-transition-all": require('./rules/no-transition-all.js'),
  "no-url-protocols": require('./rules/no-url-protocols.js'),
  "no-vendor-prefixes": require('./rules/no-vendor-prefixes.js'),
  "no-warn": require('./rules/no-warn.js'),
  "one-declaration-per-line": require('./rules/one-declaration-per-line.js'),
  "placeholder-in-extend": require('./rules/placeholder-in-extend.js'),
  "placeholder-name-format": require('./rules/placeholder-name-format.js'),
  "property-sort-order": require('./rules/property-sort-order.js'),
  "property-units": require('./rules/property-units.js'),
  "quotes": require('./rules/quotes.js'),
  "shorthand-values": require('./rules/shorthand-values.js'),
  "single-line-per-selector": require('./rules/single-line-per-selector.js'),
  "space-after-bang": require('./rules/space-after-bang.js'),
  "space-after-colon": require('./rules/space-after-colon.js'),
  "space-after-comma": require('./rules/space-after-comma.js'),
  "space-around-operator": require('./rules/space-around-operator.js'),
  "space-before-bang": require('./rules/space-before-bang.js'),
  "space-before-brace": require('./rules/space-before-brace.js'),
  "space-before-colon": require('./rules/space-before-colon.js'),
  "space-between-parens": require('./rules/space-between-parens.js'),
  "trailing-semicolon": require('./rules/trailing-semicolon.js'),
  "url-quotes": require('./rules/url-quotes.js'),
  "variable-for-property": require('./rules/variable-for-property.js'),
  "variable-name-format": require('./rules/variable-name-format.js'),
  "zero-unit": require('./rules/zero-unit.js')
};

var searchArray = function (haystack, needle) {
  var i;
  for (i = 0; i < haystack.length; i++) {
    if (haystack[i].indexOf(needle) >= 0) {
      return i;
    }
  }
  return -1;
};

module.exports = function (config) {
  var handlers = [];

  Object.keys(config.rules).forEach(function (rule) {
    var fullRule = config.rules[rule],
        loadRule,
        severity,
        options,
        ruleSearch;

    if (typeof fullRule === 'number') {
      severity = fullRule;
      options = {};
    }
    else {
      severity = fullRule[0];
      options = fullRule[1];
    }

    // Only seek out rules that are enabled
    if (severity !== 0) {
      loadRule = rules[rule];
      if (loadRule) {
        console.log('Running rule', rule);
        options = merge.recursive(true, loadRule.defaults, options);

        handlers.push({
          'rule': loadRule,
          'severity': severity,
          'options': options
        });
      }
      else {
        throw new Error('Rule `' + rule + '` could not be found!');
      }
    }
  });

  return handlers;
};
