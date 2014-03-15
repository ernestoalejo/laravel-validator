'use strict';

var _ = require('underscore');


function ValidatorBoolean(validator, name, srcname) {
  this.validator = validator;
  this.name = name;

  this.alreadyStored = false;

  this.storeExecuted = false;

  validator.output.template('boolean', {
    object: srcname,
    name: name,
  });
}


ValidatorBoolean.prototype.alreadyStoredCheck = function() {
  if (this.alreadyStored) {
    throw new Error('cannot store a value before its fully validated');
  }
};


ValidatorBoolean.prototype.custom = function(expression) {
  if (!this.storeExecuted) {
    throw new Error('you have to store the value before the custom expression');
  }
  this.validator.checkStored(expression);

  this.validator.output.template('custom', {
    name: this.name,
    expression: expression,
  });

  return this;
};


ValidatorBoolean.prototype.use = function(cls) {
  this.validator.uses.push(cls);
  return this;
};


ValidatorBoolean.prototype.store = function(key) {
  this.validator.stored[key] = true;
  this.validator.output.template('store', {
    key: key,
  });

  this.storeExecuted = true;

  return this;
};


module.exports = ValidatorBoolean;
