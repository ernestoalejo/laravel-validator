'use strict';

// Parses this structure (read from JSON, simple form data couldn't sent this)
// 
//   {
//     myarr: [
//       {
//         id: 3,
//         name: 'this string should have between 3 and 10 chars',
//         foo: 'bar',
//       },
//       {
//         id: 5,
//         foo: 'baz',
//       },
//     ],
//   }
// 
module.exports = function(validator) {
  validator.array('myarr')
    .fields(function(myarr) {

      // Tag each one of the array items as an object
      myarr.objects()
        .fields(function(obj) {

          // Numbers will be converted to strings automatically
          obj.string('id')
            .required();

          // Observe require() has not been called. The [3-10] limits will be
          // checked if the length > 1, otherwise an empty string will be place
          // in the data returned by the validator
          obj.string('name')
            .minlength(3)
            .maxlength(10);

          // Give a list of possible values for this item
          obj.string('foo')
            .in('bar', 'baz', 'qux');

        });

    });
};
