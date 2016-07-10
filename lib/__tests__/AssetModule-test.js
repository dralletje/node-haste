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

jest.autoMockOff();

var AssetModule = require('../AssetModule');

describe('AssetModule:', function () {
  var defaults = { file: '/arbitrary' };

  pit('has no dependencies by default', function () {
    return new AssetModule(defaults).getDependencies().then(function (deps) {
      return expect(deps).toEqual([]);
    });
  });

  pit('can be parametrized with dependencies', function () {
    var dependencies = ['arbitrary', 'dependencies'];
    return new AssetModule(_extends({}, defaults, { dependencies: dependencies })).getDependencies().then(function (deps) {
      return expect(deps).toEqual(dependencies);
    });
  });
});