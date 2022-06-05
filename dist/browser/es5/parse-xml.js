"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var parseXml = function () {
  function processText(string) {
    var index = string.indexOf('<');

    if (index === -1) {
      return {
        node: string,
        string: ''
      };
    }

    return {
      node: string.substring(0, index),
      string: string.substring(index)
    };
  }

  function processTag(string) {
    var openTagStartIndex = string.charAt(1) === '?' ? 2 : 1;
    var openTagEndIndex = string.indexOf('>');
    var isContainer = openTagStartIndex === 1 && string.charAt(openTagEndIndex - 1) !== '/' || openTagStartIndex === 2 && string.charAt(openTagEndIndex - 1) !== '?';
    var openTagContentEndIndex = isContainer ? openTagEndIndex : openTagEndIndex - 1;
    var tagContent = string.substring(openTagStartIndex, openTagContentEndIndex);
    var spaceIndexes = [];
    var quote = null;

    for (var index = 0, length = tagContent.length; index < length; index++) {
      var _char = tagContent.charAt(index);

      if (_char === '"' || _char === '\'') {
        if (quote === null) {
          quote = _char;
        } else if (quote === _char) {
          quote = null;
        }
      }

      if (quote === null && _char === ' ') {
        spaceIndexes.push(index);
      }
    }

    spaceIndexes.push(-1);
    var tagItems = [];
    var lastSpaceIndex = 0;

    for (var _index = 0, _length = spaceIndexes.length; _index < _length; _index++) {
      var nextSpaceIndex = spaceIndexes[_index];

      if (nextSpaceIndex === -1) {
        tagItems.push(tagContent.substring(lastSpaceIndex));
      } else {
        tagItems.push(tagContent.substring(lastSpaceIndex, nextSpaceIndex));
        lastSpaceIndex = nextSpaceIndex + 1;
      }
    }

    var node = {
      name: tagItems.shift()
    };

    if (openTagStartIndex === 2) {
      node.isDeclaration = true;
    }

    if (tagItems.length !== 0) {
      node.attributes = tagItems.reduce(function (acc, cur) {
        var _cur$split = cur.split('='),
            _cur$split2 = _slicedToArray(_cur$split, 2),
            name = _cur$split2[0],
            value = _cur$split2[1];

        acc[name] = value.substring(1, value.length - 1);
        return acc;
      }, {});
    }

    string = string.substring(openTagEndIndex + 1);

    if (isContainer) {
      var _processChildren = processChildren(string),
          nodes = _processChildren.nodes,
          newString = _processChildren.string;

      node.children = nodes;
      string = newString.substring(newString.indexOf('>') + 1);
    }

    return {
      node: node,
      string: string
    };
  }

  function processChildren(string) {
    var nodes = [];

    while (string.length > 0 && !(string.charAt(0) === '<' && string.charAt(1) === '/')) {
      var _ref = string.charAt(0) === '<' ? processTag(string) : processText(string),
          node = _ref.node,
          newString = _ref.string;

      nodes.push(node);
      string = newString;
    }

    return {
      nodes: nodes,
      string: string
    };
  }

  return function (string) {
    return processChildren(string).nodes;
  };
}();
/* exported parseXml */