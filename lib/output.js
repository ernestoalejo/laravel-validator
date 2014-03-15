'use strict';

var _ = require('underscore'),
    _s = require('underscore.string'),
    path = require('path'),
    fs = require('fs');


function Output() {
  // Current additional indentation in the code
  this.indent = 0;

  // Output
  this.validations = [];
}


Output.prototype.build = function() {
  return this.validations.join('\n');
};


/**
 * Output a new block indenting it as needed.
 * @param {string} block The new block.
 */
Output.prototype.block = function(block) {
  var prefix = _s.repeat('  ', this.indent);
  var lines = block.split('\n');
  _.forEach(lines, function(line, idx) {
    if (line.length > 0) {
      lines[idx] = prefix + line;
    }
  });
  this.validations.push(lines.join('\n'));
};


/**
 * Output a new block based on a template.
 * @param {string} filename The template name.
 * @param {Object} data The template data
 */
Output.prototype.template = function(filename, data) {
  data = data || {};
  var p = path.join(__dirname, 'templates', filename + '.tpl');
  var contents = fs.readFileSync(p).toString();
  this.block(_.template(contents, data));
};


module.exports = Output;

