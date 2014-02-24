'use strict';

var parser = require('../lang.js').parser,
    Lexer = require('lex');

module.exports = function(contents) {
  var lex = new Lexer();
  parser.lexer = lex;

  var deep = 0;

  lex.addRule(/\s+/, function() {
    // do nothing
  });

  lex.addRule(/$/, function() {
    return 'EOF';
  });

  lex.addRule(/\{/, function() {
    return 'OPEN_BRACE';
  });

  lex.addRule(/\}/, function() {
    return 'CLOSE_BRACE';
  });

  lex.addRule(/\(/, function() {
    return 'OPEN_PAREN';
  });

  lex.addRule(/\)/, function() {
    return 'CLOSE_PAREN';
  });

  lex.addRule(/,/, function() {
    return 'COMMA';
  });

  lex.addRule(/:/, function() {
    return 'COLON';
  });

  lex.addRule(/mincount\((\d+)\)/, function(lexeme, count) {
    this.yytext = count;
    return 'MINCOUNT';
  });

  lex.addRule(/-?[0-9]+/, function(lexeme) {
    this.yytext = lexeme;
    return 'NUMBER';
  });

  lex.addRule(/[A-Za-z0-9_-]+/, function(lexeme) {
    this.yytext = lexeme;

    var tokens = {
      'object': 'OBJECT',
      'string': 'STRING',
      'integer': 'INTEGER',
      'boolean': 'BOOLEAN',
      'float': 'FLOAT',
      'array': 'ARRAY',
      'switch': 'SWITCH',
      'case': 'CASE',
    };
    if (tokens[lexeme]) {
      return tokens[lexeme];
    }
    return 'NAME';
  });

  lex.addRule(/"/, function() {
    this.state = 'double_string';
  });

  lex.addRule(/(\\\"|[^"])*/, function(lexeme) {
    this.yytext = lexeme;
    return 'STRING';
  }, ['double_string']);

  lex.addRule(/"/, function() {
    this.state = 0;
  }, ['double_string']);

  lex.addRule(/'/, function() {
    this.state = 'simple_string';
  });

  lex.addRule(/(\\\'|[^'])*/, function(lexeme) {
    this.yytext = lexeme;
    return 'STRING';
  }, ['simple_string']);

  lex.addRule(/'/, function() {
    this.state = 0;
  }, ['simple_string']);

  lex.addRule(/if\s+\(/, function() {
    this.state = 'if';
    deep++;
  });

  lex.addRule(/(\\\(|\\\)|[^()])+/, function(lexeme) {
    this.yytext = lexeme.replace(/\\\(/, '(').replace(/\\\)/, ')');
    return 'IF_PART';
  }, ['if']);

  lex.addRule(/\(/, function() {
    deep++;
    this.yytext = '(';
    return 'IF_PART';
  }, ['if']);

  lex.addRule(/\)/, function() {
    deep--;
    if (deep === 0) {
      this.state = 0;
      return;
    }

    this.yytext = ')';
    return 'IF_PART';
  }, ['if']);

  lex.addRule(/case\s+\(/, function() {
    this.state = 'case';
    deep++;
  });

  lex.addRule(/(\\\(|\\\)|[^()])+/, function(lexeme) {
    this.yytext = lexeme.replace(/\\\(/, '(').replace(/\\\)/, ')');
    return 'CASE_PART';
  }, ['case']);

  lex.addRule(/\(/, function() {
    deep++;
    this.yytext = '(';
    return 'CASE_PART';
  }, ['case']);

  lex.addRule(/\)/, function() {
    deep--;
    if (deep === 0) {
      this.state = 0;
      return;
    }

    this.yytext = ')';
    return 'CASE_PART';
  }, ['case']);

  lex.addRule(/\/\*/, function() {
    this.state = 'comment';
  });

  lex.addRule(/(\*[^\/]|[^*])*/, function() {
    // ignore comments
  }, ['comment']);

  lex.addRule(/\*\//, function() {
    this.state = 0;
  }, ['comment']);

  return parser.parse(contents);
};

