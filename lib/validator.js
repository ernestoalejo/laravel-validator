'use strict';

var Output = require('./output'),
    ValidatorObject = require('./validator-object'),
    path = require('path'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    fs = require('fs');


function Validator(base, filepath) {
  this.output = new Output();

  // Sequential IDs for array variables
  this.id = 0;

  // Values stored during the validation
  this.stored = {};

  // Classes we have to import in the PHP file
  this.uses = [];

  this.filepath = filepath;

  // Calc namespace based on the file path
  var p = path.relative(base, filepath);
  this.namespace = path.dirname(p).replace(/\//g, '\\');

  // Calc class name based on the base filename
  this.classname = path.basename(filepath, path.extname(filepath));
  this.classname = _s.capitalize(_s.camelize(this.classname));
}


Validator.prototype.build = function() {
  var uses = '';
  if (this.uses.length > 0) {
    uses = 'use ' + _.unique(this.uses).join(';\nuse ') + ';';
  }

  var namespace = '';
  if (this.namespace !== '.') {
    namespace = '\\' + this.namespace.replace('/', '\\');
  }

  var p = path.join(__dirname, 'templates', 'base.tpl');
  var base = fs.readFileSync(p).toString();
  return _.template(base, {
    classname: this.classname,
    filepath: this.filepath,
    validations: this.output.build(),
    uses: uses,
    namespace: namespace,
  });
};


Validator.prototype.rootObject = function() {
  return new ValidatorObject(this, 'data', 'valid');
};


/**
 * Checks if the values needed for the condition have been stored previously.
 * It will throw an exception otherwise.
 * @param {string} condition The condition to check.
 */
Validator.prototype.checkStored = function(condition) {
  var pattern = /\$store\['([^']+)'\]/g;
  var match = pattern.exec(condition);
  while (match) {
    if (!this.stored[match[1]]) {
      throw new Error('custom condition needs stored value ' + match[1] + ', but is not present');
    }
    match = pattern.exec(condition);
  }

  pattern = /\$store\["([^"]+)"\]/g;
  match = pattern.exec(condition);
  while (match) {
    if (!this.stored[match[1]]) {
      throw new Error('custom condition needs stored value ' + match[1] + ', but is not present');
    }
    match = pattern.exec(condition);
  }
};


Validator.prototype.newArrayId = function() {
  return this.id++;
};


module.exports = Validator;
