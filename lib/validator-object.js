'use strict';

var ValidatorString = require('./validator-string'),
    ValidatorInteger = require('./validator-integer'),
    ValidatorBoolean = require('./validator-boolean'),
    ValidatorFloat = require('./validator-float'),
    _ = require('underscore');


function ValidatorObject(validator, srcname, destname) {
  this.validator = validator;
  this.srcname = srcname;
  this.destname = destname;

  this.deferred = [];
}


ValidatorObject.prototype.fields = function(fn) {
  fn(new ValidatorObjectFields(this.validator, this, this.srcname, this.destname));

  // Run the remaining deferred functions
  if (this.deferred.length) {
    _.each(this.deferred, function(fn) { fn(); });
    this.deferred = [];
  }
};


function ValidatorObjectFields(validator, object, srcname, destname) {
  this.validator = validator;
  this.object = object;
  this.srcname = srcname;
  this.destname = destname;
}


ValidatorObjectFields.prototype.common = function(name) {
  var that = this;

  // Execute old deferred methods
  if (this.object.deferred.length) {
    _.each(this.object.deferred, function(fn) { fn(); });
    this.object.deferred = [];
  }

  // Add the pre object key
  this.validator.output.template('pre-object-key', {
    object: this.srcname,
    name: name,
  });

  // Prepare the deferred method to add the post object key
  this.object.deferred.push(function() {
    that.validator.output.template('post-object-key', {
      result: that.destname,
      name: name,
    });
  });
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


module.exports = ValidatorObject;
