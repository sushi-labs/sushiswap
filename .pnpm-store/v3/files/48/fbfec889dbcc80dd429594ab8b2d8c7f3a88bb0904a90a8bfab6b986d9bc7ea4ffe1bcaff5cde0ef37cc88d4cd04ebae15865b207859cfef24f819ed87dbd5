"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CleanWebpackPlugin = void 0;

var _del = require("del");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copied from https://github.com/sindresorhus/is-plain-obj/blob/97480673cf12145b32ec2ee924980d66572e8a86/index.js
function isPlainObject(value) {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.getPrototypeOf({});
}

class CleanWebpackPlugin {
  constructor(options = {}) {
    if (isPlainObject(options) === false) {
      throw new Error(`clean-webpack-plugin only accepts an options object. See:
            https://github.com/johnagan/clean-webpack-plugin#options-and-defaults-optional`);
    } // @ts-ignore


    if (options.allowExternal) {
      throw new Error('clean-webpack-plugin: `allowExternal` option no longer supported. Use `dangerouslyAllowCleanPatternsOutsideProject`');
    }

    if (options.dangerouslyAllowCleanPatternsOutsideProject === true && options.dry !== true && options.dry !== false) {
      // eslint-disable-next-line no-console
      console.warn('clean-webpack-plugin: dangerouslyAllowCleanPatternsOutsideProject requires dry: false to be explicitly set. Enabling dry mode');
    }

    this.dangerouslyAllowCleanPatternsOutsideProject = options.dangerouslyAllowCleanPatternsOutsideProject === true || false;
    this.dry = options.dry === true || options.dry === false ? options.dry : this.dangerouslyAllowCleanPatternsOutsideProject === true || false;
    this.verbose = this.dry === true || options.verbose === true || false;
    this.cleanStaleWebpackAssets = options.cleanStaleWebpackAssets === true || options.cleanStaleWebpackAssets === false ? options.cleanStaleWebpackAssets : true;
    this.protectWebpackAssets = options.protectWebpackAssets === true || options.protectWebpackAssets === false ? options.protectWebpackAssets : true;
    this.cleanAfterEveryBuildPatterns = Array.isArray(options.cleanAfterEveryBuildPatterns) ? options.cleanAfterEveryBuildPatterns : [];
    this.cleanOnceBeforeBuildPatterns = Array.isArray(options.cleanOnceBeforeBuildPatterns) ? options.cleanOnceBeforeBuildPatterns : ['**/*'];
    /**
     * Store webpack build assets
     */

    this.currentAssets = [];
    /**
     * Only used with cleanOnceBeforeBuildPatterns
     */

    this.initialClean = false;
    this.outputPath = '';
    this.apply = this.apply.bind(this);
    this.handleInitial = this.handleInitial.bind(this);
    this.handleDone = this.handleDone.bind(this);
    this.removeFiles = this.removeFiles.bind(this);
  }

  apply(compiler) {
    if (!compiler.options.output || !compiler.options.output.path) {
      // eslint-disable-next-line no-console
      console.warn('clean-webpack-plugin: options.output.path not defined. Plugin disabled...');
      return;
    }

    this.outputPath = compiler.options.output.path;
    /**
     * webpack 4+ comes with a new plugin system.
     *
     * Check for hooks in-order to support old plugin system
     * webpack 5+ removed the old system, the check now breaks
     */

    const hooks = compiler.hooks;

    if (this.cleanOnceBeforeBuildPatterns.length !== 0) {
      hooks.emit.tap('clean-webpack-plugin', compilation => {
        this.handleInitial(compilation);
      });
    }

    hooks.done.tap('clean-webpack-plugin', stats => {
      this.handleDone(stats);
    });
  }
  /**
   * Initially remove files from output directory prior to build.
   *
   * Only happens once.
   *
   * Warning: It is recommended to initially clean your build directory outside of webpack to minimize unexpected behavior.
   */


  handleInitial(compilation) {
    if (this.initialClean) {
      return;
    }
    /**
     * Do not remove files if there are compilation errors
     *
     * Handle logging inside this.handleDone
     */


    const stats = compilation.getStats();

    if (stats.hasErrors()) {
      return;
    }

    this.initialClean = true;
    this.removeFiles(this.cleanOnceBeforeBuildPatterns);
  }

  handleDone(stats) {
    /**
     * Do nothing if there is a webpack error
     */
    if (stats.hasErrors()) {
      if (this.verbose) {
        // eslint-disable-next-line no-console
        console.warn('clean-webpack-plugin: pausing due to webpack errors');
      }

      return;
    }
    /**
     * Fetch Webpack's output asset files
     */


    const assetList = Object.keys(stats.compilation.assets);
    /**
     * Get all files that were in the previous build but not the current
     *
     * (relies on del's cwd: outputPath option)
     */

    const staleFiles = this.currentAssets.filter(previousAsset => {
      const assetCurrent = assetList.includes(previousAsset) === false;
      return assetCurrent;
    });
    /**
     * Save assets for next compilation
     */

    this.currentAssets = assetList.sort();
    const removePatterns = [];
    /**
     * Remove unused webpack assets
     */

    if (this.cleanStaleWebpackAssets === true && staleFiles.length !== 0) {
      removePatterns.push(...staleFiles);
    }
    /**
     * Remove cleanAfterEveryBuildPatterns
     */


    if (this.cleanAfterEveryBuildPatterns.length !== 0) {
      removePatterns.push(...this.cleanAfterEveryBuildPatterns);
    }

    if (removePatterns.length !== 0) {
      this.removeFiles(removePatterns);
    }
  }

  removeFiles(patterns) {
    try {
      const deleted = (0, _del.sync)(patterns, {
        force: this.dangerouslyAllowCleanPatternsOutsideProject,
        // Change context to build directory
        cwd: this.outputPath,
        dryRun: this.dry,
        dot: true,
        ignore: this.protectWebpackAssets ? this.currentAssets : []
      });
      /**
       * Log if verbose is enabled
       */

      if (this.verbose) {
        deleted.forEach(file => {
          const filename = _path.default.relative(process.cwd(), file);

          const message = this.dry ? 'dry' : 'removed';
          /**
           * Use console.warn over .log
           * https://github.com/webpack/webpack/issues/1904
           * https://github.com/johnagan/clean-webpack-plugin/issues/11
           */
          // eslint-disable-next-line no-console

          console.warn(`clean-webpack-plugin: ${message} ${filename}`);
        });
      }
    } catch (error) {
      const needsForce = /Cannot delete files\/folders outside the current working directory\./.test(error.message);

      if (needsForce) {
        const message = 'clean-webpack-plugin: Cannot delete files/folders outside the current working directory. Can be overridden with the `dangerouslyAllowCleanPatternsOutsideProject` option.';
        throw new Error(message);
      }
      /* istanbul ignore next */


      throw error;
    }
  }

}

exports.CleanWebpackPlugin = CleanWebpackPlugin;
//# sourceMappingURL=clean-webpack-plugin.js.map