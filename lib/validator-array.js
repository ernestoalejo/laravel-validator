'use strict';

var ValidatorString = require('./validator-string'),
    ValidatorInteger = require('./validator-integer'),
    ValidatorBoolean = require('./validator-boolean'),
    ValidatorFloat = require('./validator-float');


var ValidatorArray, ValidatorArrayFields;


ValidatorArray = function(validator, name, srcname, destname) {
  this.validator = validator;
  this.name = name;
  this.srcname = srcname;
  this.destname = destname;

  this.id = validator.newArrayId();

  this.mincountValue = 0;
  this.fieldsEmitted = false;
};


ValidatorArray.prototype.fields = function(fn) {
  if (this.fieldsEmitted) {
    throw new Error('cannot emit object fields twice');
  }
  this.fieldsEmitted = true;

  this.validator.output.template('pre-array', {
    object: this.srcname,
    result: this.destname,
    name: this.name,
    mincount: this.mincountValue,
    id: this.id,
  });

  var fields = new ValidatorArrayFields(this.validator, this, this.srcname, this.destname, this.id);

  this.validator.output.indent++;
  fn(fields);
  this.validator.output.indent--;

  if (!fields.emitted) {
    throw new Error('array elements have not been typed');
  }

  if (!this.avoidPost) {
    this.validator.output.template('post-array-item', {
      name: '$i' + this.id,
      result: this.destname,
    });
  }
  this.validator.output.template('post-array');
};


ValidatorArray.prototype.mincount = function(value) {
  if (this.fieldsEmitted) {
    throw new Error('cannot change mincount of array if the fields have been emitted');
  }

  this.mincountValue = value;
  return this;
};


ValidatorArrayFields = function(validator, object, srcname, destname, id) {
  this.validator = validator;
  this.object = object;
  this.srcname = srcname;
  this.destname = destname;
  this.id = id;

  this.emitted = false;
};


ValidatorArrayFields.prototype.common = function(avoidPost) {
  if (this.emitted) {
    throw new Error('cannot type array fields twice');
  }
  this.emitted = true;

  this.object.avoidPost = avoidPost;
};


ValidatorArrayFields.prototype.strings = function() {
  this.common();
  var name = '$i' + this.id;
  var srcname = this.srcname + '[' + name + ']';
  return new ValidatorString(this.validator, name, srcname);
};


ValidatorArrayFields.prototype.integers = function() {
  this.common();
  var name = '$i' + this.id;
  var srcname = this.srcname + '[' + name + ']';
  return new ValidatorInteger(this.validator, name, srcname);
};


ValidatorArrayFields.prototype.booleans = function() {
  this.common();
  var name = '$i' + this.id;
  var srcname = this.srcname + '[' + name + ']';
  return new ValidatorBoolean(this.validator, name, srcname);
};


ValidatorArrayFields.prototype.floats = function() {
  this.common();
  var name = '$i' + this.id;
  var srcname = this.srcname + '[' + name + ']';
  return new ValidatorFloat(this.validator, name, srcname);
};


ValidatorArrayFields.prototype.objects = function() {
  this.common(true);

  var name = '$i' + this.id;
  var srcname = this.srcname + '[' + name + ']';
  var destname = this.destname + '[' + name + ']';

  this.validator.output.template('object', {
    object: srcname,
    result: destname,
    name: name,
  });

  var ValidatorObject = require('./validator-object');
  return new ValidatorObject(this.validator, srcname, destname);
};


ValidatorArrayFields.prototype.array = function() {
  var name = '$i' + this.id;
  var srcname = this.srcname + '[' + name + ']';
  var destname = this.destname + '[' + name + ']';
  this.common(true);

  return new ValidatorArray(this.validator, name, srcname, destname);
};


module.exports = ValidatorArray;
