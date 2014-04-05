'use strict';

var validator = require('../index.js'),
    fs = require('fs');

// 
// Code needed to generate PHP code from the JS file.
// You can also use the Grunt/Gulp task to automate all this generation steps.
// 
// After generating Contact.php you'll have to put that file somewhere in your app.
// I like to store them in lib/Validators/Contact.php for example, and use:
// 
// "autoload": {
//   "psr-0": {
//     "Validators": "app/lib"
//   }
// },
// 
// in my composer.json file.
// 
// Then simply use it like this in your controller:
// 
//   $data = \Validators\Contact::validate();
//   
//   ..... code here .....
//   
//   foofunc($data['name'], $data['email'], $data['message']);
//   
//   ..... code here .....
// 
// If the validation fails, a 403 HTTP error is automatically sent and the error
// and the input are logged to app/storage/logs/laravel.log
// 
// Validation input data is read using Input::all(), so JSON sent in the body of
// the request, query params sent in the URL, and form data are parsed correctly.
// 

// Generated code is placed inside a namespace, based on the folder structure
// This path will allow the generator to calc the correct name.
var baseFolder = 'validators';

// File to read
var file = 'validators/contact.js';

var generated = validator.generate(baseFolder, file);

// Write the generated code
fs.writeFileSync('Contact.php', generated);
