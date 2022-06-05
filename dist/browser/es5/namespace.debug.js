"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var Namespace = function () {
  function foo(bar) {
    if (!(bar == null || _typeof(bar) !== 'object')) {
      throw 'Argument "bar" is invalid.';
    }

    console.log(bar == null ? 'Hello World' : bar);
  }

  return {
    foo: foo
  };
}();
/* exported HtmlFactory */