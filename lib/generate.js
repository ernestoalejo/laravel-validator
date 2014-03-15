'use strict';

var _ = require('underscore'),
    path = require('path'),
    Validator = require('./validator');


// /**
//  * Generates a new array sequential ID for the counter and variables.
//  * @return {Number} Array ID.
//  * @private
//  */
// Generator.prototype.generateArrayId = function() {
//   return this.id++;
// };

// /**
//  * @param {Object} rule The rule to check.
//  * @return {boolean} True if it's a string, integer, boolean or float rule.
//  * @private
//  */
// Generator.prototype.isSimple = function(rule) {
//   var simpleRules = ['string', 'integer', 'boolean', 'float'];
//   return simpleRules.indexOf(rule.type) > -1;
// };

// /**
//  * Handle any kind of rule, dispatching to the correct method based on
//  * its type.
//  * @param {Object} source The rule.
//  * @param {string} srcname The source object name.
//  * @param {string} destname The result object name.
//  */
// Generator.prototype.handle = function(source, srcname, destname) {
//   var name = source.name;
//   if (!source.insideArray) {
//     name = '\'' + source.name + '\'';
//   }
//   if (source.name) {
//     srcname = srcname + '[' + name + ']';
//     destname = destname + '[' + name + ']';
//   }

//   switch (source.type) {
//     case 'object':
//       this.template('object', {
//         object: srcname,
//         result: destname,
//         name: name,
//       });
//       this.handleObject(source, srcname, destname);
//       break;

//     case 'array':
//       this.template('array', {
//         object: srcname,
//         result: destname,
//         name: name,
//         mincount: source.mincount,
//       });
//       this.handleArray(source, srcname, destname);
//       break;

//     case 'conditional':
//       this.handleConditional(source, srcname, destname);
//       break;

//     case 'switch':
//       this.handleSwitch(source, srcname, destname);
//       break;

//     case 'string':
//     case 'integer':
//     case 'boolean':
//     case 'float':
//       this.handleSimple(source, srcname);
//       break;
      
//     default:
//       throw new Error('unrecognized field type: ' + source.type);
//   }
// };


// *
//  * Handles an array rule.
//  * @param {Object} source The rule.
//  * @param {string} srcname The source object name.
//  * @param {string} destname The result object name.
 
// Generator.prototype.handleArray = function(source, srcname, destname) {
//   var id = this.generateArrayId();

//   // Open the for loop
//   this.template('pre-array', {
//     object: srcname,
//     result: destname,
//     id: id,
//   });

//   // Indent & generate the sub-validations
//   this.indent++;
//   source.fields.insideArray = true;
//   source.fields.name = '$i' + id;
//   this.handle(source.fields, srcname, destname);

//   if (this.isSimple(source.fields)) {
//     this.template('post-array-item', {
//       result: destname,
//       name: '$i' + id,
//     });
//   }
//   this.indent--;

//   // This post block always has to be here, closing the for loop
//   this.template('post-array');
// };

// /**
//  * Handles a conditional rule.
//  * @param {Object} source The rule.
//  * @param {string} srcname The source object name.
//  * @param {string} destname The result object name.
//  */
// Generator.prototype.handleConditional = function(source, srcname, destname) {
//   this.checkStored(source.condition);

//   // Open the if block
//   this.template('pre-conditional', {
//     condition: source.condition,
//   });

//   // Indent & generate the sub-validations
//   this.indent++;
//   this.handleObject(source, srcname, destname);

//   // Outdent & close the if block
//   this.indent--;
//   this.template('post-conditional');
// };

// /**
//  * Handles a switch rule.
//  * @param {Object} source The rule.
//  * @param {string} srcname The source object name.
//  * @param {string} destname The result object name.
//  */
// Generator.prototype.handleSwitch = function(source, srcname, destname) {
//   var that = this;

//   _.forEach(source.cases, function(scase) {
//     that.checkStored(scase.condition);

//     // Open the if block
//     that.template('pre-conditional', {
//       condition: scase.condition,
//     });

//     // Indent & generate the sub-validations
//     that.indent++;
//     that.handleObject(scase, srcname, destname);

//     // Outdent & close the if block
//     that.indent--;
//     that.template('post-conditional');
//   });
// };

// /**
//  * Handle a simple rule (string, integer, boolean or float)
//  * @param {Object} source The rule.
//  * @param {string} srcname The source object name.
//  */
// Generator.prototype.handleSimple = function(source, srcname) {
//   var type = source.type;

//   var name = '\'' + source.name + '\'';
//   this.template(type, {
//     object: srcname,
//     name: name,
//   });

//   var runned = {};
//   runned[type] = true;

//   var alreadyStored = '';
//   var that = this;

//   _.forEach(source.requirements, function(req) {
//     // Check if it exists
//     if (!processors[req.name]) {
//       throw new Error('validator processor not recognized: ' + req.name);
//     }

//     // Don't let processors store a value before they're fully validated
//     if (req.name != 'custom' && alreadyStored) {
//       throw new Error('processor [' + alreadyStored + '] has stored a ' +
//         'value before it was fully validated; move this processor to the end');
//     }

//     if (req.name === 'custom') {
//       that.checkStored(req.arguments[0]);
//     }

//     // Run the processor
//     var result = processors[req.name](req.arguments);

//     // Processor dependencies
//     if (result.requires) {
//       var found = _.some(result.requires, function(r) {
//         return runned[r];
//       });
//       if (!found) {
//         throw new Error('processor [' + req.name + '] needs one of [' +
//             result.requires.join(', ') + '] before to run correctly');
//       }
//     }
//     if (result.requiresStored) {
//       var all = _.every(result.requiresStored, function(r) {
//         return that.stored[r];
//       });
//       if (!all) {
//         throw new Error('processor [' + req.name + '] needs stored values [' +
//             result.requiresStored + '] before to run correctly');
//       }
//     }
    
//     // Processor PHP dependencies
//     if (result.uses) {
//       that.uses = that.uses.concat(result.uses);
//     }

//     // Processor template
//     if (result.template) {
//       if (!result.data) {
//         result.data = {};
//       }
//       result.data.name = name;
//       that.template(result.template, result.data);
//     }

//     // Save stored values
//     if (result.stored) {
//       alreadyStored = req.name;

//       // Mark each stored key as used
//       _.each(result.stored, function(st) {
//         if (that.stored[st]) {
//           throw new Error('processor [' + req.name + '] has tried to store again [' +
//             st + '], though it is already used by other processor');
//         }
//         that.stored[st] = true;
//       });
//     }

//     runned[req.name] = true;
//   });
// };


module.exports = function(base, filepath) {
  var generator = require(path.resolve(filepath));
  if (!_.isFunction(generator)) {
    throw new Error('the form module should be a function: ' + filepath);
  }

  var validator = new Validator(base, filepath);
  validator.rootObject().fields(generator);

  return validator.build();
};
