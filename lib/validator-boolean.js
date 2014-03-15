'use strict';

var _ = require('underscore');


function ValidatorBoolean(validator, name, srcname) {
  this.validator = validator;
  this.name = name;

  this.alreadyStored = false;

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


ValidatorBoolean.prototype.custom = function(condition) {
  this.validator.checkStored(condition);
};


module.exports = ValidatorBoolean;
