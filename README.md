
laravel-validator
=================

> Generate PHP validations from short and concise descriptions of the input format.

**NOTE:** This project is not related to the Laravel official Validator class. It's
a stricter and statically generated alternative to it.

 * [Install](#install)
 * [Getting started](#getting-started)
 * [Validator files](#validator-files)
 * [Requirements reference](#requirements-reference)


## <a name="install"></a> Install

```shell
npm install --save-dev laravel-validator
```

There are plugins for [Grunt](https://github.com/ernestoalejo/grunt-laravel-validator)
and [Gulp](https://github.com/ernestoalejo/gulp-laravel-validator).


## <a name="getting-started"></a> Getting started

Create a `example.val` file containing this:

```
string examplestr {required maxlength(3)}
```

I put the files under `app/validators`, though it can be any folder.

Then you can compile it from Javascript:

```js
var validator = require('laravel-validator'),
    fs = require('fs');

var filename = 'example.val';
var contents = fs.readFileSync(filename);
var generated = validator.generate(filename, contents);
fs.writeFileSync('example.php');
```

The generated `example.php` file should be in a folder that Laravel can load.
For example it can be inside `app/lib/Validators`, including this snnipet in
the `composer.json` file:

```json
"autoload": {
  "psr-0": {
    "Validators": "app/lib"
  }
}
```

To use it in PHP:

```php
class ExampleController extends BaseController {

  public function store() {
    $data = \Validators\Example::validate();
    ... $data['examplestr']; ...
  }

}
```

You can send the data in the query params (`http://example.com/url?examplestr=foo`)
or in the request body as JSON:

```json
{"examplestr":"foo"}
```


## <a name="validator-files"></a> Validator files

Validator files are written in a custom and concise language.

 * [Simple rules](#simple-rules)
 * [Requirements for simple rules](#simple-rules-requirements)
 * [Objects](#objects)
 * [Arrays](#arrays)
 * [Conditionals](#conditionals)
 * [Switchs](#switchs)
 * [Comments](#comments)


### <a name="simple-rules"></a> Simple rules

They validate simple types: strings, integers, booleans and floats.

```
string foo
boolean bar
integer baz
float qux
```

### <a name="simple-rules-requirements"></a> Requirements for simple rules

Knowing that a field it's a string or an integer it's not enough in most of the cases.
You'll need to apply regexps, minlengths, etc. You can specify the requirements
for a field between braces.

Some requirements receive arguments (like the minlength one). You can pass integer
and string literals in a function-like way.

String literals can be wrapper with simple `'` and double quotes `"`.

```
string foo {required minlength(3)}
string bar {
  required
  maxlength(8)
}

string options {
  in("bar", "baz")
}

integer myint {positive}
```

You can specify the requirements in the same line, splitted in several lines, etc.Newlines don't count in the syntax.


### <a name="objects"></a> Objects

You're not limited to parse plain structures, you can read objects and arrays too.

Objects have a name and a list of rules for the keys of that object, and they can be
used recursively.

```
object foo {
  string mykey1
  string mykey2 {required}
}

object bar {
  string mykey3

  object baz {
    integer mykey4
  }
}
```


### <a name="arrays"></a> Arrays

Arrays follows a similar way for their declarations, though they can have one
field only. That field will indicate the type of each one of the items.

You can restrict the minimum number of items that must be present. See the example
for the syntax.

NOTE: You cannot parse arrays that have different elements with different types
and requirements.

```
array foo {
  string fields
}

array bar {
  mincount(3)
  string fields
}

array baz {
  string fields {minlength(3) maxlength(5)}
}
```

You can combine rules as you want. For example this will parse and object with
an array called foo. That array will have objects as items, each one with two
fields: an integer called baz and a string called qux.

```
array foo {
  object bar {
    integer baz {positive}
    string qux {required}
  }
}
```

Note that in the previous example the name "bar" was completely ignored, it doesn't
make sense. To help with that redundant option the convention is to name it
"fields" when it's needed (simple rules: strings, booleans, floats and
integers) or to explicitly avoid it when not (arrays, objects).

For example the previous snippet could be shortened as this.

```
array foo {
  object {
    integer baz {positive}
    string qux {required}
  }
}
```


### <a name="conditionals"></a> Conditionals

The language lets you specify special conditions for some rules, so you can
apply validations depending on the input you receive.

For that purpose you need two things: save the field you need in a variable;
and second specify the condition on that variable.

To save fields the runtime code provides a `$store` array that gets populated
automatically. Note that you can only save simple values in it (strings, integer,
booleans, floats). When you want to save a value, use the `store` requirement.

To specify the condition use an if-like syntax, containing PHP valid code.

For example, if you want to parse the same field as integer or string depending
on an input flag, you can make this.

```
string dep {
  in("foo", "bar")
  store("mydep")
}

if ($store['mydep'] === 'foo') {
  integer myfield {positive}
}

if ($store['mydep'] === 'bar' && 3 > 2) {
  string myfield {required minlength(3)}
}
```

There's no `else` block in the language by the moment.


### <a name="switchs"></a> Switchs

If you have a lot of conditions one after the other you can make a shorter code
using the switch block. Note they're provided only to clean up your code; internally
they get converted into if's blocks.

If the original example was this.

```
string foo {
  store("foo")
}

if ($store['foo'] === 'foo1') {
  string bar {required}
}

if ($store['foo'] === 'foo2') {
  object bar {
    string key1
    string key2
  }
}
```

You can convert it to a switch block similar to this.

```
string foo {
  store("foo")
}

switch {
  case ($store['foo'] === 'foo1') {
    string bar {required}
  }

  case ($store['foo'] === 'foo2') {
    object bar {
      string key1
      string key2
    }
  }
}
```


### <a name="comments"></a> Comments

Finally, this wouldn't be a good language if things can't be commented out quickly.
You can make comments using the `/*` and `*/` syntax.

```
string foo /* comment, this will get ignored */
/*
  it can span several lines if you need it
 */
string bar
```


## <a name="requirements-reference"></a> Requirements reference

 * [custom](#custom)
 * [datetime](#datetime)
 * [email](#email)
 * [in](#in)
 * [inarray](#inarray)
 * [length](#length)
 * [match](#match)
 * [maxdatetime](#maxdatetime)
 * [maxlength](#maxlength)
 * [maxvalue](#maxvalue)
 * [mindatetime](#mindatetime)
 * [minlength](#minlength)
 * [minvalue](#minvalue)
 * [positive](#positive)
 * [regexp](#regexp)
 * [required](#required)
 * [store](#store)
 * [url](#url)
 * [use](#use)


### <a name="custom"></a> custom
*Applies to*: `string`, `boolean`, `integer`, `float`.
*Args*: `code (string)`.
*Requires*: `store`

Allows you to apply custom validations **to this field**. If you want to apply more
general conditions use [Conditionals](#conditionals) better.

It requires that you store first the value of the field.

The argument received should be valid PHP code.

```
string myfield {
  required
  minlength(3)

  store("myfield")

  custom("$store['myfield'] === 'foo'")
}
```


### <a name="datetime"></a> datetime
*Applies to*: `string`.
*Args*: `no args`.

Checks that the field it's a valid datetime. It uses the Carbon library, so the
expected formats are any of the accepted ones by the constructor.


### <a name="email"></a> email
*Applies to*: `string`.
*Args*: `no args`.

Validates email addresses using the same regular expression that Angular.JS uses.


### <a name="in"></a> in
*Applies to*: `string`.
*Args*: `values (string)`.

Checks that the received string is one of the provided. You can specify as many
arguments as you need.

```
string foo {
  in("foo")
}

string foobar {
  in("foo", "bar", "baz", "qux")
}
```


### <a name="inarray"></a> inarray
*Applies to*: `string`.
*Args*: `array name (string)`.

The same as `in`, but allows you to easily read a runtime array for the list.

```
string lang {
  required
  use("Config")
  inarray("Config::get('langs.available')")
}
```


### <a name="length"></a> length
*Applies to*: `string`.
*Args*: `length (integer)`.

The length of the string should match exactly that number of characters.


### <a name="match"></a> match
*Applies to*: `string`.
*Args*: `stored (string)`.

Checks that the value matchs a previously stored one.


### <a name="maxdatetime"></a> maxdatetime
*Applies to*: `string`.
*Args*: `datetime (string)`.
*Requires*: `datetime`.

Check value to see if it's equal or before the specified limit. Datetime could be any
string that the Carbon constructor can read.


### <a name="maxlength"></a> maxlength
*Applies to*: `string`.
*Args*: `length (integer)`.

Checks that the string has less or equal characters than the maximum.


### <a name="maxvalue"></a> maxvalue
*Applies to*: `integer`, `float`.
*Args*: `limit (integer)`.

Checks that the field value it's less or equal than the provided limit (it's inclusive).


### <a name="mindatetime"></a> mindatetime
*Applies to*: `string`.
*Args*: `datetime (string)`.
*Requires*: `datetime`.

Check value to see if it's equal or after the specified limit. Datetime could be any
string that the Carbon constructor can read.


### <a name="minlength"></a> minlength
*Applies to*: `string`.
*Args*: `length (integer)`.

If the string is not empty, it should have at least that number of characters.
To check for empty strings use the `required` requirement.


### <a name="minvalue"></a> minvalue
*Applies to*: `integer`, `float`.
*Args*: `limit (integer)`.

Checks that the field value it's equal or greater than the provided limit (it's inclusive).


### <a name="positive"></a> positive
*Applies to*: `integer`, `float`.
*Args*: `no args`.

Checks the value to see if it's equal or greater than zero. It's equivalent to `minvalue(0)`.


### <a name="regexp"></a> regexp
*Applies to*: `string`.
*Args*: `regexp (string)`.

Apply a regexp to the value to see if it matches. Remember the regexp should be valid in PHP.

```
string myfield {regexp("/[a-z][0-9]/")}
```

### <a name="required"></a> required
*Applies to*: `string`.
*Args*: `no args`.

The string should have one or more characters.


### <a name="store"></a> store
*Applies to*: `string`, `integer`, `float`, `boolean`.
*Args*: `name (string)`.

Save the value of this field in the `$store` array, under the provided name. You
can later access it in conditionals and switchs like `$store['name']`.

See [Conditionals](#conditionals) for more info.


### <a name="url"></a> url
*Applies to*: `string`.
*Args*: `no args`.

Validate URLs using the same regular expression Angular.JS uses.


### <a name="use"></a> use
*Applies to*: `string`, `boolean`, `integer`, `float`.
*Args*: `class (string)`.

Imports a new class into the runtime PHP file.

```
string lang {
  required
  use("Config")
  store("lang")
  custom("Config::get('langs.' . $store['lang']) === 'active'")
}
```


