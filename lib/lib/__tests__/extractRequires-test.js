/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

jest.dontMock('../extractRequires');
jest.dontMock('../replacePatterns');

var extractRequires = require('../extractRequires');

describe('extractRequires', function () {
  it('should extract both requires and imports from code', function () {
    var code = '\n      import module1 from \'module1\';\n      const module2 = require(\'module2\');\n      const module3 = require(`module3`);\n    ';

    expect(extractRequires(code)).toEqual({
      code: code,
      deps: { sync: ['module1', 'module2', 'module3'] }
    });
  });

  it('should extract requires in order', function () {
    var code = '\n      const module1 = require(\'module1\');\n      const module2 = require(\'module2\');\n      const module3 = require(\'module3\');\n    ';

    expect(extractRequires(code)).toEqual({
      code: code,
      deps: { sync: ['module1', 'module2', 'module3'] }
    });
  });

  it('should strip out comments from code', function () {
    var code = '// comment';

    expect(extractRequires(code)).toEqual({
      code: '',
      deps: { sync: [] }
    });
  });

  it('should ignore requires in comments', function () {
    var code = ['// const module1 = require("module1");', '/**', ' * const module2 = require("module2");', ' */'].join('\n');

    expect(extractRequires(code)).toEqual({
      code: '\n',
      deps: { sync: [] }
    });
  });

  it('should ignore requires in comments with Windows line endings', function () {
    var code = ['// const module1 = require("module1");', '/**', ' * const module2 = require("module2");', ' */'].join('\r\n');

    expect(extractRequires(code)).toEqual({
      code: '\r\n',
      deps: { sync: [] }
    });
  });

  it('should ignore requires in comments with unicode line endings', function () {
    var code = ['// const module1 = require("module1");\u2028', '// const module1 = require("module2");\u2029', '/*\u2028', 'const module2 = require("module3");\u2029', ' */'].join('');

    expect(extractRequires(code)).toEqual({
      code: '\u2028\u2029',
      deps: { sync: [] }
    });
  });

  it('should dedup duplicated requires', function () {
    var code = '\n      const module1 = require(\'module1\');\n      const module1Dup = require(\'module1\');\n    ';

    expect(extractRequires(code)).toEqual({
      code: code,
      deps: { sync: ['module1'] }
    });
  });
});