'use strict';

var ValidatorString = require('./validator-string'),
    ValidatorInteger = require('./validator-integer'),
    ValidatorBoolean = require('./validator-boolean'),
    ValidatorFloat = require('./validator-float'),
    ValidatorArray = require('./validator-array'),
    _ = require('underscore');


function ValidatorObject(validator, srcname, destname) {
  this.validator = validator;
  this.srcname = srcname;
  this.destname = destname;

  this.deferred = [];

  this.fieldsEmitted = false;
}


ValidatorObject.prototype.fields = function(fn) {
  if (this.fieldsEmitted) {
    throw new Error('cannot emit object fields twice');
  }
  this.fieldsEmitted = true;

  fn(new ValidatorObjectFields(this.validator, this, this.srcname, this.destname));

  // Run the remaining deferred functions
  if (this.deferred.length) {
    _.each(this.deferred, function(fn) { fn(); });
    this.deferred = [];
  }
};


ValidatorObject.prototype.content = ValidatorObject.prototype.fields;


function ValidatorObjectFields(validator, object, srcname, destname) {
  this.validator = validator;
  this.baseObject = object;
  this.srcname = srcname;
  this.destname = destname;
}


ValidatorObjectFields.prototype.common = function(name, avoidPost) {
  var that = this;

  // Execute old deferred methods
  if (this.baseObject.deferred.length) {
    _.each(this.baseObject.deferred, function(fn) { fn(); });
    this.baseObject.deferred = [];
  }

  // Add the pre object key
  this.validator.output.template('pre-object-key', {
    object: this.srcname,
    name: name,
  });

  if (!avoidPost) {
    // Prepare the deferred method to add the post object key
    this.baseObject.deferred.push(function() {
      that.validator.output.template('post-object-key', {
        result: that.destname,
        name: name,
      });
    });
  }
};


ValidatorObjectFields.prototype.string = function(name) {
  name = '\'' + name + '\'';
  var srcname = this.srcname + '[' + name + ']';
  this.common(name);
  return new ValidatorString(this.validator, name, srcname);
};


ValidatorObjectFields.prototype.integer = function(name) {
  name = '\'' + name + '\'';
  var srcname = this.srcname + '[' + name + ']';
  this.common(name);
  return new ValidatorInteger(this.validator, name, srcname);
};


ValidatorObjectFields.prototype.boolean = function(name) {
  name = '\'' + name + '\'';
  var srcname = this.srcname + '[' + name + ']';
  this.common(name);
  return new ValidatorBoolean(this.validator, name, srcname);
};


ValidatorObjectFields.prototype.float = function(name) {
  name = '\'' + name + '\'';
  var srcname = this.srcname + '[' + name + ']';
  this.common(name);
  return new ValidatorFloat(this.validator, name, srcname);
};


ValidatorObjectFields.prototype.object = function(name) {
  name = '\'' + name + '\'';
  var srcname = this.srcname + '[' + name + ']';
  var destname = this.destname + '[' + name + ']';
  this.common(name, true);

  this.validator.output.template('object', {
    object: srcname,
    result: destname,
    name: name,
  });

  return new ValidatorObject(this.validator, srcname, destname);
};


ValidatorObjectFields.prototype.array = function(name) {
  name = '\'' + name + '\'';
  var srcname = this.srcname + '[' + name + ']';
  var destname = this.destname + '[' + name + ']';
  this.common(name, true);

  return new ValidatorArray(this.validator, name, srcname, destname);
};


ValidatorObjectFields.prototype.conditional = function(condition) {
  var that = this;

  this.validator.checkStored(condition);

  // Execute old deferred methods
  if (this.baseObject.deferred.length) {
    _.each(this.baseObject.deferred, function(fn) { fn(); });
    this.baseObject.deferred = [];
  }

  this.validator.output.template('pre-conditional', {
    condition: condition,
  });
  this.validator.output.indent++;

  this.baseObject.deferred.push(function() {
    that.validator.output.indent--;
    that.validator.output.template('post-conditional');
  });

  return new ValidatorObject(this.validator, this.srcname, this.destname);
};


module.exports = ValidatorObject;
