'use strict';


module.exports = function(validator) {
  validator.string('myname')
    .required()
    .minlength(3);
};
