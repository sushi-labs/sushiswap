cookie-cutter
=============

Set and get cookies in the browser or in node with `document`.

In your browser code with [browserify](http://github.com/substack/node-browserify):

````javascript
var cookie = require('cookie-cutter');
var times = parseInt(cookie.get('times'), 10) || 0;
cookie.set('times', times + 1);
````

and `times` will increment every time the page is reloaded.

methods
=======

````javascript
var cookie = require('cookie-cutter');
````

cookie(document)
----------------

Return a new cookie object with `.get()` and `.set()` operating on `document`.

`document.cookie` should be a non-referentially transparent setter/getter combo
like the DOM's variant where assignment with optional path and expiry creates a
new cookie in the getter as a key=value pair.

cookie.get(key)
---------------

Return the cookie value for `key`.

cookie.set(key, value, opts={})
-------------------------------

Set the cookie at `key` to `value` with optional parameters `expires` and `path`.

To unset a cookie, use a date in the past, ex: ```{ expires: new Date(0) }```


install
=======

With [npm](http://npmjs.org) do:

    npm install cookie-cutter

license
=======

MIT/X11
