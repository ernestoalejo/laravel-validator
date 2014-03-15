'use strict';

var _ = require('underscore');


function ValidatorInteger(validator, name, srcname) {
  this.validator = validator;
  this.name = name;

  this.alreadyStored = false;

  this.storeExecuted = false;

  validator.output.template('integer', {
    object: srcname,
    name: name,
  });
}


ValidatorInteger.prototype.alreadyStoredCheck = function() {
  if (this.alreadyStored) {
    throw new Error('cannot store a value before its fully validated');
  }
};


ValidatorInteger.prototype.custom = function(expression) {
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


ValidatorInteger.prototype.use = function(cls) {
  this.validator.uses.push(cls);
  return this;
};


ValidatorInteger.prototype.minvalue = function(val) {
  if (!_.isNumber(val)) {
    throw new Error('minvalue argument should be the value: ' + val);
  }
  this.alreadyStoredCheck();

  this.validator.output.template('minvalue', {
    name: this.name,
    value: val,
  });

  return this;
};


ValidatorInteger.prototype.maxvalue = function(val) {
  if (!_.isNumber(val)) {
    throw new Error('maxvalue argument should be the value: ' + val);
  }
  this.alreadyStoredCheck();

  this.validator.output.template('maxvalue', {
    name: this.name,
    value: val,
  });

  return this;
};


ValidatorInteger.prototype.positive = function() {
  this.alreadyStoredCheck();

  this.validator.output.template('positive', {
    name: this.name,
  });

  return this;
};


ValidatorInteger.prototype.store = function(key) {
  this.validator.stored[key] = true;
  this.validator.output.template('store', {
    key: key,
  });

  this.storeExecuted = true;

  return this;
};


module.exports = ValidatorInteger;
