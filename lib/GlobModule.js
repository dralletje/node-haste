/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Module = require('./Module');

RegExp.escape = function (s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

var GlobModule = function (_Module) {
  _inherits(GlobModule, _Module);

  function GlobModule() {
    var _Object$getPrototypeO;

    _classCallCheck(this, GlobModule);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(GlobModule)).call.apply(_Object$getPrototypeO, [this].concat(args)));
  }

  _createClass(GlobModule, [{
    key: 'isHaste',
    value: function isHaste() {
      return Promise.resolve(false);
    }
  }, {
    key: 'getCode',
    value: function getCode(transformOptions) {
      return this.read(transformOptions).then(function (_ref) {
        var code = _ref.code;
        return code;
      });
    }
  }, {
    key: 'getMap',
    value: function getMap(transformOptions) {
      return Promise.resolve(null);
    }
  }, {
    key: 'getName',
    value: function getName() {
      return Promise.resolve(this.path);
    }
  }, {
    key: 'getPackage',
    value: function getPackage() {
      return null;
    }
  }, {
    key: 'getDependencies',
    value: function getDependencies(transformOptions) {
      return this.read(transformOptions).then(function (_ref2) {
        var dependencies = _ref2.dependencies;
        return dependencies;
      });
    }
  }, {
    key: 'invalidate',
    value: function invalidate() {}
  }, {
    key: 'read',
    value: function read(transformOptions) {
      var _path$match = this.path.match(/(.*)\/([^/]+)$/);

      var _path$match2 = _slicedToArray(_path$match, 3);

      var dir = _path$match2[1];
      var file = _path$match2[2];

      var pattern = '^' + RegExp.escape(file).replace(/\\\*/g, '([^/.]+)') + '$';
      var filenamePattern = /\/([^/.]*).[^/.]+$/;
      var matches = this._fastfs.matches(dir, pattern);
      var dependencies = matches.map(function (x) {
        return '.' + x.slice(dir.length);
      });

      var exportObjectEntries = dependencies.map(function (name) {
        var match = name.match(filenamePattern);
        if (match) {
          var filename = match[1];
          return '  \'' + filename + '\': require(\'' + name + '\'),\n';
        } else {
          return '';
        }
      }).join('');
      var source = 'module.exports = {\n' + exportObjectEntries + '\n};';

      var transformCode = this._transformCode;
      var codePromise = transformCode ? transformCode(this, source, transformOptions) : Promise.resolve({ code: source });

      return codePromise.then(function (result) {
        return _extends({}, result, {
          source: source,
          id: undefined
        });
      });
    }
  }, {
    key: 'hash',
    value: function hash() {
      return 'Module : ' + this.path;
    }
  }, {
    key: 'isJSON',
    value: function isJSON() {
      return false;
    }
  }, {
    key: 'isAsset',
    value: function isAsset() {
      return false;
    }
  }, {
    key: 'isPolyfill',
    value: function isPolyfill() {
      return false;
    }
  }, {
    key: 'isAsset_DEPRECATED',
    value: function isAsset_DEPRECATED() {
      return false;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        hash: this.hash(),
        isJSON: this.isJSON(),
        isAsset: this.isAsset(),
        isAsset_DEPRECATED: this.isAsset_DEPRECATED(),
        type: this.type,
        path: this.path
      };
    }
  }]);

  return GlobModule;
}(Module);

module.exports = GlobModule;