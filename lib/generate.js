'use strict';

var _ = require('underscore'),
    path = require('path'),
    Validator = require('./validator');


module.exports = function(base, filepath) {
  var generator = require(path.resolve(filepath));
  if (!_.isFunction(generator)) {
    throw new Error('the form module should be a function: ' + filepath);
  }

  var validator = new Validator(base, filepath);
  validator.rootObject().fields(generator);

  return validator.build();
};
