'use strict';

var _ = require('underscore');


function ValidatorString(validator, name, srcname) {
  this.validator = validator;
  this.name = name;

  this.alreadyStored = false;

  validator.output.template('string', {
    object: srcname,
    name: name,
  });
}


ValidatorString.prototype.alreadyStoredCheck = function() {
  if (this.alreadyStored) {
    throw new Error('cannot store a value before its fully validated');
  }
};


ValidatorString.prototype.required = function() {
  this.alreadyStoredCheck();

  this.validator.uses.push('Str');
  this.validator.output.template('required', {
    name: this.name,
  });

  return this;
};


ValidatorString.prototype.minlength = function(len) {
  if (!_.isNumber(len)) {
    throw new Error('minlength argument should be the length: ' + len);
  }
  this.alreadyStoredCheck();

  this.validator.uses.push('Str');
  this.validator.output.template('minlength', {
    name: this.name,
    length: len,
  });

  return this;
};


ValidatorString.prototype.custom = function(condition) {
  this.validator.checkStored(condition);
};


module.exports = ValidatorString;
