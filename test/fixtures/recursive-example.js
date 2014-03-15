'use strict';


module.exports = function(validator) {
  validator.object('myobj')
    .fields(function(myobj) {
      myobj.string('fstring');

      myobj.object('fobj2')
        .fields(function(myobj2) {
          myobj2.integer('finteger');
        });
    });

  validator.array('farr1')
    .fields(function(farr1) {
      farr1.strings();
    });

  validator.array('farr')
    .mincount(2)
    .fields(function(farr) {
      farr.strings();
    });

  validator.string('params')
    .required();

  validator.array('farrobj')
    .fields(function(farrobj) {
      farrobj.objects()
        .fields(function(obj) {
          obj.string('fstring')
            .required();
        });
    });

  validator.array('farr1')
    .fields(function(farr1) {
      farr1.array()
        .fields(function(farr2) {
          farr2.array()
            .fields(function(farr3) {
              farr3.objects()
                .fields(function(obj) {
                  obj.boolean('inner');
                });
            });
        });
    });

  validator.string('ffoo')
    .store('foo');

  validator.string('fbar')
    .store('bar');

  validator.conditional('$store["foo"] === "bar"')
    .content(function(cond) {
      cond.object('conditional')
        .fields(function(obj) {
          obj.string('fstring');
        });
    });

  validator.conditional('true')
    .content(function(cond) {
      cond.string('mystr')
        .required();
    });

  validator.conditional('false')
    .content(function(cond) {
      cond.array('myarr')
        .fields(function(myarr) {
          myarr.integers();
        });
    });

  validator.conditional('false')
    .content(function(cond) {
      cond.object('myarr_extended')
        .fields(function(obj) {
          obj.conditional('$store["bar"] === "bar"')
            .content(function(cond2) {
              cond2.object('qux')
                .fields(function(qux) {
                  qux.boolean('myqux');
                });
            });
        });
    });

  validator.conditional('$store["bar"] === "baz"')
    .content(function(cond) {
      cond.string('foo')
        .required();
    });

  validator.conditional('$store["bar"] === "qux"')
    .content(function(cond) {
      cond.integer('foo')
        .positive();
    });

  validator.string('example')
    .required()
    .in('before,after', 'before2,after2');
};

