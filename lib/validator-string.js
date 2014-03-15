'use strict';

var _ = require('underscore');


function ValidatorString(validator, name, srcname) {
  this.validator = validator;
  this.name = name;

  this.alreadyStored = false;

  this.storeExecuted = false;
  this.datetimeExecuted = false;

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


ValidatorString.prototype.custom = function(expression) {
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


ValidatorString.prototype.store = function(key) {
  this.validator.stored[key] = true;
  this.validator.output.template('store', {
    key: key,
  });

  this.storeExecuted = true;

  return this;
};


ValidatorString.prototype.email = function() {
  this.alreadyStoredCheck();
  
  this.validator.output.template('email', {
    name: this.name,
  });

  return this;
};


ValidatorString.prototype.url = function() {
  this.alreadyStoredCheck();

  this.validator.output.template('url', {
    name: this.name,
  });

  return this;
};


ValidatorString.prototype.regexp = function(regexp) {
  if (!_.isString(regexp)) {
    throw new Error('regexp argument should be a string, php regexps are not the same as javascript ones');
  }
  this.alreadyStoredCheck();

  this.validator.output.template('regexp', {
    name: this.name,
    regexp: regexp,
  });

  return this;
};


ValidatorString.prototype.length = function(len) {
  if (!_.isNumber(len)) {
    throw new Error('length argument should be the length: ' + len);
  }
  this.alreadyStoredCheck();

  this.validator.uses.push('Str');
  this.validator.output.template('length', {
    name: this.name,
    length: len,
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


ValidatorString.prototype.maxlength = function(len) {
  if (!_.isNumber(len)) {
    throw new Error('maxlength argument should be the length: ' + len);
  }
  this.alreadyStoredCheck();

  this.validator.uses.push('Str');
  this.validator.output.template('maxlength', {
    name: this.name,
    length: len,
  });

  return this;
};


ValidatorString.prototype.use = function(cls) {
  this.validator.uses.push(cls);
  return this;
};


ValidatorString.prototype.in = function() {
  var args = _.toArray(arguments);
  if (!args.length) {
    throw new Error('you should pass the list of arguments to the in function');
  }
  this.alreadyStoredCheck();

  this.validator.output.template('in', {
    name: this.name,
    values: args.join('\', \''),
  });

  return this;
};


ValidatorString.prototype.inarray = function(arr) {
  this.alreadyStoredCheck();

  this.validator.output.template('inarray', {
    name: this.name,
    values: arr,
  });

  return this;
};


ValidatorString.prototype.match = function(stored) {
  if (!this.validator.stored[stored]) {
    throw new Error('match needs ' + stored + ' but it has not been stored previously');
  }
  this.alreadyStoredCheck();

  this.validator.output.template('match', {
    name: this.name,
    other: stored,
  });

  return this;
};


ValidatorString.prototype.datetime = function() {
  this.alreadyStoredCheck();

  this.validator.output.template('datetime', {
    name: this.name,
  });

  this.datetimeExecuted = true;

  return this;
};


ValidatorString.prototype.mindatetime = function(datetime) {
  if (!this.datetimeExecuted) {
    throw new Error('datetime required before mindatetime');
  }
  this.alreadyStoredCheck();

  this.validator.uses.push('Carbon\\Carbon');
  this.validator.output.template('mindatetime', {
    name: this.name,
    datetime: datetime,
  });

  return this;
};


ValidatorString.prototype.maxdatetime = function(datetime) {
  if (!this.datetimeExecuted) {
    throw new Error('datetime required before maxdatetime');
  }
  this.alreadyStoredCheck();

  this.validator.uses.push('Carbon\\Carbon');
  this.validator.output.template('maxdatetime', {
    name: this.name,
    datetime: datetime,
  });

  return this;
};


module.exports = ValidatorString;
