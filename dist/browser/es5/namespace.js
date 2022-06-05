"use strict";

var Namespace = function () {
  function foo(bar) {
    console.log(bar == null ? 'Hello World' : bar);
  }

  return {
    foo: foo
  };
}();
/* exported HtmlFactory */