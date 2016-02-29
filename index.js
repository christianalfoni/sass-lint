'use strict';

var slConfig = require('./lib/config'),
    groot = require('./lib/groot'),
    helpers = require('./lib/helpers'),
    slRules = require('./lib/rules');

var sassLint = function (config) {
  config = require('./lib/config')(config);
  return;
};

/**
 * Takes any user specified options and a configPath
 * which returns a compiled config object
 *
 * @param {object} config user specified rules/options passed in
 * @param {string} configPath path to a config file
 * @returns {object} the compiled config object
 */
sassLint.getConfig = function (config, configPath) {
  return slConfig(config, configPath);
};

/**
 * Parses our results object to count errors and return
 * paths to files with detected errors.
 *
 * @param {object} results our results object
 * @returns {object} errors object containing the error count and paths for files incl. errors
 */
sassLint.errorCount = function (results) {
  var errors = {
    count: 0,
    files: []
  };

  results.forEach(function (result) {
    if (result.errorCount) {
      errors.count += result.errorCount;
      errors.files.push(result.filePath);
    }
  });

  return errors;
};

/**
 * Parses our results object to count warnings and return
 * paths to files with detected warnings.
 *
 * @param {object} results our results object
 * @returns {object} warnings object containing the error count and paths for files incl. warnings
 */
sassLint.warningCount = function (results) {
  var warnings = {
    count: 0,
    files: []
  };

  results.forEach(function (result) {
    if (result.warningCount) {
      warnings.count += result.warningCount;
      warnings.files.push(result.filePath);
    }
  });

  return warnings;
};

/**
 * Parses our results object to count warnings and errors and return
 * a cumulative count of both
 *
 * @param {object} results our results object
 * @returns {int} the cumulative count of errors and warnings detected
 */
sassLint.resultCount = function (results) {
  var warnings = this.warningCount(results),
      errors = this.errorCount(results);

  return warnings.count + errors.count;
};

/**
 * Runs each rule against our AST tree and returns our main object of detected
 * errors, warnings, messages and filenames.
 *
 * @param {object} file file object from fs.readFileSync
 * @param {object} options user specified rules/options passed in
 * @param {string} configPath path to a config file
 * @returns {object} an object containing error & warning counts plus lint messages for each parsed file
 */
sassLint.lintText = function (file, options, config) {
  var rules = slRules(this.getConfig(options, config)),
      ast = {},
      detects,
      results = [],
      errors = 0,
      warnings = 0;

  try {
    ast = groot(file.text, file.format, file.filename);
  }
  catch (e) {
    var line = e.line || 1;
    errors++;

    results = [{
      ruleId: 'Fatal',
      line: line,
      column: 1,
      message: e.message,
      severity: 2
    }];
  }

  if (ast.content && ast.content.length > 0) {
    rules.forEach(function (rule) {
      detects = rule.rule.detect(ast, rule);
      results = results.concat(detects);
      if (detects.length) {
        if (rule.severity === 1) {
          warnings += detects.length;
        }
        else if (rule.severity === 2) {
          errors += detects.length;
        }
      }
    });
  }

  results.sort(helpers.sortDetects);

  return {
    'filePath': file.filename,
    'warningCount': warnings,
    'errorCount': errors,
    'messages': results
  };
};

/**
 * Handles formatting of results using EsLint formatters
 *
 * @param {object} results our results object
 * @param {object} options user specified rules/options passed in
 * @param {string} configPath path to a config file
 * @returns {object} results our results object in the user specified format
 */
sassLint.format = function (results, options, configPath) {
  var config = this.getConfig(options, configPath),
      format = config.options.formatter.toLowerCase();

  var formatted = require('eslint/lib/formatters/' + format);

  return formatted(results);
};

/**
 * Handles outputting results whether this be straight to the console/stdout or to a file.
 * Passes results to the format function to ensure results are output in the chosen format
 *
 * @param {object} results our results object
 * @param {object} options user specified rules/options passed in
 * @param {string} configPath path to a config file
 * @returns {object} results our results object
 */
sassLint.outputResults = function (results, options, configPath) {
  var config = this.getConfig(options, configPath);

  if (this.resultCount(results)) {

    var formatted = this.format(results, options, configPath);
    console.log(formatted);
  }
  return results;
};

/**
 * Throws an error if there are any errors detected. The error includes a count of all errors
 * and a list of all files that include errors.
 *
 * @param {object} results our results object
 * @returns {void}
 */
sassLint.failOnError = function (results) {
  var errorCount = this.errorCount(results);

  if (errorCount.count > 0) {
    throw new Error(errorCount.count + ' errors were detected in \n- ' + errorCount.files.join('\n- '));
  }
};

module.exports = sassLint;
