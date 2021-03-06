'use strict';

var validator = require('../index'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    expect = require('expect.js');
    

describe('Full examples: ', function() {
  it('should generate the recursive example', function(callback) {
    var name = 'recursive-example';
    var generated = validator.generate('test/fixtures', 'test/fixtures/' + name + '.js');

    var expected = fs.readFileSync('test/expected/' + name + '.php');
    mkdirp(path.dirname('tmp/' + name + '.php'), function() {
      fs.writeFileSync('tmp/' + name + '.php', generated);
      expect(generated).to.be(expected.toString());
      callback();
    });
  });

  it('should generate the min example', function(callback) {
    var name = 'min-example';
    var generated = validator.generate('test/fixtures', 'test/fixtures/' + name + '.js');

    var expected = fs.readFileSync('test/expected/' + name + '.php');
    mkdirp(path.dirname('tmp/' + name + '.php'), function() {
      fs.writeFileSync('tmp/' + name + '.php', generated);
      expect(generated).to.be(expected.toString());
      callback();
    });
  });

  it('should generate the plain example', function(callback) {
    var name = 'plain-example';
    var generated = validator.generate('test/fixtures', 'test/fixtures/' + name + '.js');

    var expected = fs.readFileSync('test/expected/' + name + '.php');
    mkdirp(path.dirname('tmp/' + name + '.php'), function() {
      fs.writeFileSync('tmp/' + name + '.php', generated);
      expect(generated).to.be(expected.toString());
      callback();
    });
  });

  it('should generate the subfolder example', function(callback) {
    var name = 'subfolder/example';
    var generated = validator.generate('test/fixtures', 'test/fixtures/' + name + '.js');

    var expected = fs.readFileSync('test/expected/' + name + '.php');
    mkdirp(path.dirname('tmp/' + name + '.php'), function() {
      fs.writeFileSync('tmp/' + name + '.php', generated);
      expect(generated).to.be(expected.toString());
      callback();
    });
  });
});
