/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

jest.dontMock('../getInverseDependencies');

var getInverseDependencies = require('../getInverseDependencies');

describe('getInverseDependencies', function () {
  it('', function () {
    var module1 = createModule('module1', ['module2', 'module3']);
    var module2 = createModule('module2', ['module3', 'module4']);
    var module3 = createModule('module3', ['module4']);
    var module4 = createModule('module4', []);

    var modulePairs = {
      'module1': [['module2', module2], ['module3', module3]],
      'module2': [['module3', module3], ['module4', module4]],
      'module3': [['module4', module4]],
      'module4': []
    };

    var resolutionResponse = {
      dependencies: [module1, module2, module3, module4],
      getResolvedDependencyPairs: function getResolvedDependencyPairs(module) {
        return modulePairs[module.hash()];
      }
    };

    var dependencies = getInverseDependencies(resolutionResponse);
    var actual = // jest can't compare maps and sets
    Array.from(dependencies.entries()).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var key = _ref2[0];
      var value = _ref2[1];
      return [key, Array.from(value)];
    });

    expect(actual).toEqual([[module2, [module1]], [module3, [module1, module2]], [module4, [module2, module3]]]);
  });
});

function createModule(name, dependencies) {
  return {
    hash: function hash() {
      return name;
    },
    getName: function getName() {
      return Promise.resolve(name);
    },
    getDependencies: function getDependencies() {
      return Promise.resolve(dependencies);
    }
  };
}