/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const Module = require('./Module');

RegExp.escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

class GlobModule extends Module {

  constructor(...args) {
    super(...args);
  }

  isHaste() {
    return Promise.resolve(false);
  }

  getCode(transformOptions) {
    return this.read(transformOptions).then(({code}) => code);
  }

  getMap(transformOptions) {
    return Promise.resolve(null);
  }

  getName() {
    return Promise.resolve(this.path);
  }

  getPackage() {
    return null;
  }

  getDependencies(transformOptions) {
    return this.read(transformOptions).then(({dependencies}) => dependencies);
  }

  invalidate() {}

  read(transformOptions) {
    const [, dir, file] = this.path.match(/(.*)\/([^/]+)$/);
    const pattern = '^' + RegExp.escape(file).replace(/\\\*/g, '([^/.]+)') + '$';
    const filenamePattern = /\/([a-zA-Z][^/.]*).[^/.]+$/;
    const matches = this._fastfs.matches(dir, pattern);
    const dependencies = matches.map(x => {
      return '.' + x.slice(dir.length);
    });

    const exportObjectEntries = dependencies.map(name => {
      const match = name.match(filenamePattern);
      if (match) {
        const filename = match[1];
        return `  '${filename}': require('${name}'),\n`;
      } else {
        return ``;
      }
    })
    .join('');
    const source = `module.exports = {\n${exportObjectEntries}\n};`

    const transformCode = this._transformCode;
    const codePromise = transformCode
        ? transformCode(this, source, transformOptions)
        : Promise.resolve({code: source});

    return codePromise.then(result => {
      return {
        ...result,
        source,
        id: undefined,
      };
    });
  }

  hash() {
    return `Module : ${this.path}`;
  }

  isJSON() {
    return false;
  }

  isAsset() {
    return false;
  }

  isPolyfill() {
    return false;
  }

  isAsset_DEPRECATED() {
    return false;
  }

  toJSON() {
    return {
      hash: this.hash(),
      isJSON: this.isJSON(),
      isAsset: this.isAsset(),
      isAsset_DEPRECATED: this.isAsset_DEPRECATED(),
      type: this.type,
      path: this.path,
    };
  }
}

module.exports = GlobModule;
