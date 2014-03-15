'use strict';


module.exports = {

  minlength: function(args) {
    if (args.length != 1 || ) {
      throw new Error('minlength validation needs an integer as the first arg only');
    }

    return {
      template: 'minlength',
      requires: ['string'],
      uses: ['Str'],
      data: {
        length: args[0],
      },
    };
  },

  maxlength: function(args) {
    if (args.length != 1 || !parseInt(args[0], 10)) {
      throw new Error('maxlength validation needs an integer as the first arg only');
    }

    return {
      template: 'maxlength',
      requires: ['string'],
      uses: ['Str'],
      data: {
        length: args[0],
      },
    };
  },

  length: function(args) {
    if (args.length != 1 || !parseInt(args[0], 10)) {
      throw new Error('length validation needs an integer as the first arg only');
    }

    return {
      template: 'length',
      requires: ['string'],
      uses: ['Str'],
      data: {
        length: args[0],
      },
    };
  },

  email: function() {
    return {
      template: 'email',
      requires: ['string'],
    };
  },

  store: function(args) {
    if (args.length != 1) {
      throw new Error('store processor needs a key name as the first arg only');
    }

    return {
      template: 'store',
      stored: [args[0]],
      data: {
        key: args[0],
      },
    };
  },

  custom: function(args) {
    if (args.length != 1) {
      throw new Error('custom validation needs a PHP expression as the first arg only');
    }

    return {
      template: 'custom',
      requires: ['store'],
      data: {
        expression: args[0],
      },
    };
  },

  datetime: function() {
    return {
      template: 'datetime',
      uses: ['Carbon\\Carbon', '\\DateTimeZone'],
      requires: ['string'],
    };
  },

  use: function(args) {
    if (args.length != 1) {
      throw new Error('use processor needs a class name & namespace as the first arg only');
    }

    return {
      uses: [args[0]],
    };
  },

  in: function(args) {
    if (args.length < 1) {
      throw new Error('in validation needs a list of items to check');
    }

    return {
      requires: ['string'],
      template: 'in',
      data: {
        values: args.join('\', \''),
      },
    };
  },

  inarray: function(args) {
    if (args.length != 1) {
      throw new Error('inarray validation needs the name of an array of items as the first arg only');
    }

    return {
      requires: ['string'],
      template: 'inarray',
      data: {
        values: args[0],
      },
    };
  },

  match: function(args) {
    if (args.length != 1) {
      throw new Error('match validation needs the name of the store of the other field as the first arg only');
    }

    return {
      requires: ['string'],
      requiresStored: [args[0]],
      template: 'match',
      data: {
        other: args[0],
      },
    };
  },

  minvalue: function(args) {
    if (args.length != 1 || !parseInt(args[0], 10)) {
      throw new Error('minvalue validation needs an integer as the first arg only');
    }

    return {
      template: 'minvalue',
      requires: ['integer', 'float'],
      data: {
        value: args[0],
      },
    };
  },

  maxvalue: function(args) {
    if (args.length != 1 || !parseInt(args[0], 10)) {
      throw new Error('maxvalue validation needs an integer as the first arg only');
    }

    return {
      template: 'maxvalue',
      requires: ['integer', 'float'],
      data: {
        value: args[0],
      },
    };
  },

  positive: function() {
    return {
      template: 'positive',
      requires: ['integer', 'float'],
    };
  },

  regexp: function(args) {
    if (args.length != 1) {
      throw new Error('match validation needs the regular expression as the first arg only');
    }

    return {
      requires: ['string'],
      template: 'regexp',
      data: {
        regexp: args[0],
      },
    };
  },

  url: function() {
    return {
      requires: ['string'],
      template: 'url',
    };
  },

  mindatetime: function(args) {
    if (args.length != 1) {
      throw new Error('mindatetime validation needs a datetime as the first arg only');
    }

    return {
      requires: ['datetime'],
      template: 'mindatetime',
      uses: ['Carbon\\Carbon'],
      data: {
        datetime: args[0],
      },
    };
  },

  maxdatetime: function(args) {
    if (args.length != 1) {
      throw new Error('maxdatetime validation needs a datetime as the first arg only');
    }

    return {
      requires: ['datetime'],
      template: 'maxdatetime',
      uses: ['Carbon\\Carbon'],
      data: {
        datetime: args[0],
      },
    };
  },

};

