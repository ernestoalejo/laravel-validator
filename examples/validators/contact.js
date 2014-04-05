'use strict';

// Simple example to validate data from a contact form
module.exports = function(validator) {
  // Minlength doesn't imply required
  validator.string('name')
    .required()
    .minlength(3)
    .maxlength(10);

  // Email and url are validated according to Angular regexps
  validator.string('email')
    .required()
    .email();

  validator.string('url')
    .required()
    .url();

  validator.string('message')
    .required()
    .minlength(10)
    .maxlength(500);
};
