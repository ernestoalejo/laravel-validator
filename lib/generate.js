'use strict';

var _ = require('underscore'),
    _s = require('underscore.string'),
    fs = require('fs'),
    processors = require('./processors'),
    path = require('path');

var Generator = function(filepath) {
  // Sequential IDs for array variables
  this.id = 0;

  // Current additional indentation in the code
  this.indent = 0;

  // Output
  this.validations = [];

  // Values stored during the validation
  this.stored = {};

  // Classes we have to import in the PHP file
  this.uses = [];

  this.filepath = filepath;

  // Calc namespace based on the file path
  this.namespace = path.dirname(filepath).replace('/', '\\');

  // Calc class name based on the base filename
  this.classname = path.basename(filepath, path.extname(filepath));
  this.classname = _s.capitalize(_s.camelize(this.classname));
};

/**
 * Output a new block indenting it as needed.
 * @param {string} block The new block.
 */
Generator.prototype.outputBlock = function(block) {
  var prefix = _s.repeat('  ', this.indent);
  var lines = block.split('\n');
  _.forEach(lines, function(line, idx) {
    if (line.length > 0) {
      lines[idx] = prefix + line;
    }
  });
  this.validations.push(lines.join('\n'));
};

/**
 * Output a new block based on a template.
 * @param {string} filename The template name.
 * @param {Object} data The template data
 */
Generator.prototype.template = function(filename, data) {
  data = data || {};
  var contents = fs.readFileSync('./lib/templates/' + filename + '.tpl').toString();
  this.outputBlock(_.template(contents, data));
};

Generator.prototype.build = function() {
  var uses = '';
  if (this.uses.length > 0) {
    uses = 'use ' + _.unique(this.uses).join(';\nuse ') + ';';
  }

  var namespace = '';
  if (this.namespace !== '.') {
    namespace = '\\' + this.namespace.replace('/', '\\');
  }

  var base = fs.readFileSync('./lib/templates/base.tpl').toString();
  return _.template(base, {
    classname: this.classname,
    filepath: this.filepath,
    validations: this.validations.join('\n'),
    uses: uses,
    namespace: namespace,
  });
};

Generator.prototype.generateArrayId = function() {
  return this.id++;
};

Generator.prototype.isSimple = function(rule) {
  var simpleRules = ['string', 'integer', 'boolean', 'float'];
  return simpleRules.indexOf(rule.type) > -1;
};

Generator.prototype.handle = function(source, srcname, destname) {
  var name = source.name;
  if (!source.insideArray) {
    name = '\'' + source.name + '\'';
  }
  if (source.name) {
    srcname = srcname + '[' + name + ']';
    destname = destname + '[' + name + ']';
  }

  switch (source.type) {
    case 'object':
      this.template('object', {
        object: srcname,
        result: destname,
        name: name,
      });
      this.handleObject(source, srcname, destname);
      break;

    case 'array':
      this.template('array', {
        object: srcname,
        result: destname,
        name: name,
        mincount: source.mincount,
      });
      this.handleArray(source, srcname, destname);
      break;

    case 'conditional':
      this.handleConditional(source, srcname, destname);
      break;

    case 'switch':
      this.handleSwitch(source, srcname, destname);
      break;

    case "string":
    case "integer":
    case "boolean":
      this.handleSimple(source.type, source, srcname, destname);
      break;
      
    default:
      throw new Error('unrecognized field type: ' + source.type);
  }
};

Generator.prototype.handleObject = function(source, srcname, destname) {
  var that = this;

  _.each(source.rules, function(rule) {
    if (!rule.name && rule.type !== 'conditional' && rule.type !== 'switch') {
      throw new Error('object fields should have names always');
    }

    var name = '';
    if (rule.name) {
      name = '\'' + rule.name + '\'';

      // Object specific validations per key
      that.template('pre-object-key', {
        object: srcname,
        name: name,
      });
    }

    that.handle(rule, srcname, destname);

    if (that.isSimple(rule) && rule.name) {
      that.template('post-object-key', {
        result: destname,
        name: name,
      });
    }
  });
};

Generator.prototype.handleArray = function(source, srcname, destname) {
  var id = this.generateArrayId();

  // Open the for loop
  this.template('pre-array', {
    object: srcname,
    result: destname,
    id: id,
  });

  // Indent & generate the sub-validations
  this.indent++;
  source.fields.insideArray = true;
  source.fields.name = '$i' + id;
  this.handle(source.fields, srcname, destname);

  if (this.isSimple(source.fields)) {
    this.template('post-array-item', {
      result: destname,
      name: '$i' + id,
    });
  }
  this.indent--;

  // This post block always has to be here, closing the for loop
  this.template('post-array');
};

Generator.prototype.handleConditional = function(source, srcname, destname) {
  var that = this;

  // Open the if block
  this.template('pre-conditional', {
    condition: source.condition,
  });

  // Indent & generate the sub-validations
  this.indent++;
  this.handleObject(source, srcname, destname);

  // Outdent & close the if block
  this.indent--;
  this.template('post-conditional');
};

Generator.prototype.handleSwitch = function(source, srcname, destname) {
  var that = this;

  _.forEach(source.cases, function(scase) {
    // Open the if block
    that.template('pre-conditional', {
      condition: scase.condition,
    });

    // Indent & generate the sub-validations
    that.indent++;
    that.handleObject(scase, srcname, destname);

    // Outdent & close the if block
    that.indent--;
    that.template('post-conditional');
  });
};

Generator.prototype.handleSimple = function(type, source, srcname, destname) {
  var name = '\'' + source.name + '\'';
  this.template(type, {
    object: srcname,
    name: name,
  });

  var runned = {};
  runned[type] = true;

  var alreadyStored = '';
  var that = this;

  _.forEach(source.requirements, function(req) {
    // Check if it exists
    if (!processors[req.name]) {
      throw new Error('validator processor not recognized: ' + req.name);
    }

    // Don't let processors store a value before they're fully validated
    if (req.name != 'custom' && alreadyStored) {
      throw new Error('processor [' + alreadyStored + '] has stored a ' +
        'value before it was fully validated; move this processor to the end');
    }

    // Run the processor
    var result = processors[req.name](req.arguments);

    // Processor dependencies
    if (result.requires) {
      var found = _.some(result.requires, function(r) {
        return runned[r];
      });
      if (!found) {
        throw new Error('processor [' + req.name + '] needs one of [' +
            result.requires.join(', ') + '] before to run correctly');
      }
    }
    if (result.requiresStored) {
      var all = _.every(result.requiresStored, function(r) {
        return that.stored[r];
      });
      if (!all) {
        throw new Error('processor [' + req.name + '] needs stored value [' +
            result.requiresStored[k] + '] before to run correctly');
      }
    }
    
    // Processor PHP dependencies
    if (result.uses) {
      that.used = that.uses.concat(result.uses);
    }

    // Processor template
    if (result.template) {
      if (!result.data) {
        result.data = {};
      }
      result.data.name = name;
      that.template(result.template, result.data);
    }

    // Save stored values
    if (result.stored) {
      alreadyStored = req.name;

      // Mark each stored key as used
      _.each(result.stored, function(st) {
        if (that.stored[st]) {
          throw new Error('processor [' + req.name + '] has tried to store again [' +
            st + '], though it is already used by other processor');
        }
        that.stored[st] = true;
      });
    }

    runned[req.name] = true;
  });
};

module.exports = function(filepath, source) {
  var generator = new Generator(filepath);
  generator.handleObject(source, 'data', 'valid');
  return generator.build();
};
