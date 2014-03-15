'use strict';


module.exports = function(validator) {
  validator.string('fstring');
  validator.integer('finteger');
  validator.boolean('fboolean');
  validator.float('ffloat');

  validator.string('fother')
    .store('other');

  validator.string('fstringv')
    .email()
    .url()
    .regexp('/^[a-b]$/')
    .length(3)
    .minlength(4)
    .maxlength(5)
    .use('MyNamespace\\MyClass1')
    .use('MyNamespace\\MyClass2')
    .use('MyNamespace\\MyClass1')
    .in('value1', 'value2', 'value3')
    .in('before,after', 'before2,after')
    .use('Config')
    .inarray('Config::get("example")')
    .match('other')
    .store('fsv')
    .custom('$store["fsv"] === "foo"');

  validator.integer('fintegerv')
    .use('MyNamespace\\MyClass1')
    .minvalue(3)
    .maxvalue(7)
    .positive()
    .store('fiv')
    .custom('$store["fiv"] > 3');

  validator.string('fdatetimev')
    .datetime()
    .mindatetime('today')
    .maxdatetime('tomorrow');

  validator.float('ffloatv')
    .minvalue(3)
    .maxvalue(7);
};
