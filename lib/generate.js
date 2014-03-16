'use strict';

var _ = require('underscore'),
    path = require('path'),
    Validator = require('./validator');


module.exports = function(base, filepath) {
  function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
  }

  var generator = requireUncached(path.resolve(filepath));
  if (!_.isFunction(generator)) {
    throw new Error('the validator module should export a function: ' + filepath);
  }

  var validator = new Validator(base, filepath);
  validator.rootObject().fields(generator);

  return validator.build();
};
