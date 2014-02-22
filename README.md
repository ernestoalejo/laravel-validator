
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
},
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
