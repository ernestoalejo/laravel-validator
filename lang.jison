
%{
  function Validator(rules) {
    this.type = 'object';
    this.name = 'root';
    this.rules = rules;
  }

  function VObject(name, rules) {
    this.type = 'object';
    this.name = name;
    this.rules = rules;
  }

  function VString(name, requirements) {
    this.type = 'string';
    this.name = name;
    this.requirements = requirements;
  }

  function VInteger(name, requirements) {
    this.type = 'integer';
    this.name = name;
    this.requirements = requirements;
  }

  function VBoolean(name, requirements) {
    this.type = 'boolean';
    this.name = name;
    this.requirements = requirements;
  }

  function VArray(name, mincount, fields) {
    this.type = 'array';
    this.name = name;
    this.mincount = mincount;
    this.fields = fields;
  }

  function VRequirement(name, arguments) {
    this.name = name;
    this.arguments = arguments;
  }

  function VConditional(condition, rules) {
    this.type = 'conditional';
    this.condition = condition;
    this.rules = rules;
  }

  function VSwitch(cases) {
    this.type = 'switch';
    this.cases = cases;
  }

  function VCase(condition, rules) {
    this.type = 'case';
    this.condition = condition;
    this.rules = rules;
  }
%}

%start Validator

%%

Validator
  : Rules "EOF"
    { return new Validator($1); }
  ;

Rules
  : Rule Rules
    { $$ = [$1].concat($2); }
  | /* empty */
    { $$ = []; }
  ;

Rule
  : Object
  | Array
  | Conditional
  | Switch
  | String
  | Integer
  | Boolean
  ;

Object
  : OBJECT NAME OPEN_BRACE Rules CLOSE_BRACE
    { $$ = new VObject($2, $4); }
  | OBJECT OPEN_BRACE Rules CLOSE_BRACE
    { $$ = new VObject('', $3); }
  ;

Array
  : ARRAY NAME OPEN_BRACE ArrayDescription CLOSE_BRACE
    { $$ = new VArray($2, $4[0], $4[1]); }
  | ARRAY OPEN_BRACE ArrayDescription CLOSE_BRACE
    { $$ = new VArray('', $3[0], $3[1]); }
  ;

ArrayDescription
  : Rule
    { $$ = [0, $1]; }
  | MINCOUNT Rule
    { $$ = [Number($1), $2]; }
  ;

Conditional
  : IfCondition OPEN_BRACE Rules CLOSE_BRACE
    { $$ = new VConditional($1.join(''), $3); }
  ;

IfCondition
  : IF_PART
    { $$ = [$1]; }
  | IF_PART IfCondition
    { $$ = [$1].concat($2); }
  ;

Switch
  : SWITCH OPEN_BRACE CaseBlocks CLOSE_BRACE
    { $$ = new VSwitch($3); }
  ;

CaseBlocks
  : /* empty */
    { $$ = []; }
  | CaseBlock CaseBlocks
    { $$ = [$1].concat($2); }
  ;

CaseBlock
  : CaseCondition OPEN_BRACE Rules CLOSE_BRACE
    { $$ = new VCase($1.join(''), $3); }
  ;

CaseCondition
  : CASE_PART
    { $$ = [$1]; }
  | CASE_PART CaseCondition
    { $$ = [$1].concat($2); }
  ;

String
  : STRING NAME Requirements
    { $$ = new VString($2, $3); }
  ;

Integer
  : INTEGER NAME Requirements
    { $$ = new VInteger($2, $3); }
  ;

Boolean
  : BOOLEAN NAME Requirements
    { $$ = new VBoolean($2, $3); }
  ;

Requirements
  : /* empty */
    { $$ = []; }
  | OPEN_BRACE RequirementList CLOSE_BRACE
    { $$ = $2; }
  ;

RequirementList
  : /* empty */
    { $$ = []; }
  | Requirement RequirementList
    { $$ = [$1].concat($2); }
  ;

Requirement
  : NAME
    { $$ = new VRequirement($1, []); }
  | NAME OPEN_PAREN RequirementArguments CLOSE_PAREN
    { $$ = new VRequirement($1, $3); }
  ;

RequirementArguments
  : /* empty */
    { $$ = []; }
  | STRING
    { $$ = [$1]; }
  | STRING COMMA RequirementArguments
    { $$ = [$1].concat($3); }
  | NUMBER
    { $$ = [$1]; }
  | NUMBER COMMA RequirementArguments
    { $$ = [$1].concat($3); }
  ;

%%
