const path = require('path');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  webpack: {
    configure: (config) => {
      // Remove guard against importing modules outside of `src`.
      // Needed for workspace projects.
      config.resolve.plugins = config.resolve.plugins.filter(
        (plugin) => !(plugin instanceof ModuleScopePlugin)
      );

      config.plugins.push(new MonacoWebpackPlugin({
        languages: ['json', 'xml']
      }));

      // Add support for importing workspace projects.
      config.resolve.plugins.push(
        new TsConfigPathsPlugin({
          configFile: path.resolve(__dirname, 'tsconfig.json'),
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
          mainFields: ['module', 'main'],
        })
      );

      config.resolve.fallback = {
        // process: require.resolve("process/browser"),
        // zlib: require.resolve("browserify-zlib"),
        stream: require.resolve("stream-browserify"),
        // util: require.resolve("util"),
        buffer: require.resolve("buffer"),
        // asset: require.resolve("assert"),
      }

      // Replace include option for babel loader with exclude
      // so babel will handle workspace projects as well.
      config.module.rules[1].oneOf.forEach((r) => {
        if (r.loader && r.loader.indexOf('babel') !== -1) {
          r.exclude = /node_modules/;
          delete r.include;
        }
      });

      config["ignoreWarnings"] = [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource.includes("node_modules") &&
            warning.details &&
            warning.details.includes("source-map-loader")
          );
        },
      ]

      return config;
    },
    plugins: {
      add: [
        new CopyPlugin({
          patterns: [{
            from: "../../node_modules/@hpcc-js/wasm/dist/graphvizlib.wasm",
            to: "static/js/"
          }],
        }),
      ],
    },
  },
  jest: {
    configure: (config) => {
      config.resolver = '@nrwl/jest/plugins/resolver';
      return config;
    },
  },
};
