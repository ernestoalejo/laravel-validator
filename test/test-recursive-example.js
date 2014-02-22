'use strict';

var validator = require('../index'),
    fs = require('fs'),
    should = require('should'),
    mkdirp = require('mkdirp'),
    path = require('path');

describe('Recursive example: ', function() {
  it('should parse correctly', function(callback) {
    var name = 'recursive-example';
    var contents = fs.readFileSync('test/fixtures/' + name + '.val');
    var source = validator.parser(contents.toString());
    var generated = validator.generate(name + '.val', source);

    var expected = fs.readFileSync('test/expected/' + name + '.php');
    mkdirp(path.dirname('tmp/' + name + '.php'), function() {
      fs.writeFileSync('tmp/' + name + '.php', generated);
      generated.should.equal(expected.toString());
      callback();
    });
  });
});
