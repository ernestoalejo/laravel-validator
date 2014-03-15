'use strict';

var _ = require('underscore');


function ValidatorFloat(validator, name, srcname) {
  this.validator = validator;
  this.name = name;

  this.alreadyStored = false;

  this.storeExecuted = false;

  validator.output.template('float', {
    object: srcname,
    name: name,
  });
}


ValidatorFloat.prototype.alreadyStoredCheck = function() {
  if (this.alreadyStored) {
    throw new Error('cannot store a value before its fully validated');
  }
};


ValidatorFloat.prototype.custom = function(expression) {
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


ValidatorFloat.prototype.use = function(cls) {
  this.validator.uses.push(cls);
  return this;
};


ValidatorFloat.prototype.minvalue = function(val) {
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


ValidatorFloat.prototype.maxvalue = function(val) {
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


ValidatorFloat.prototype.positive = function() {
  return this.minvalue(0);
};


ValidatorFloat.prototype.store = function(key) {
  this.validator.stored[key] = true;
  this.validator.output.template('store', {
    key: key,
  });

  this.storeExecuted = true;

  return this;
};


module.exports = ValidatorFloat;
