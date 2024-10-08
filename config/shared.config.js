const { resolve } = require('node:path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { execSync } = require('node:child_process');
const webpack = require('webpack');

// NOTE: This file is not meant to be consumed directly by weback. Instead it
// should be imported, initialized with the following settings and exported like
// a normal webpack config. See config/start.config.js for an example

const isBuild = process.env.NODE_ENV === 'production';

// only run git when PULP_UI_COMMIT is NOT provided
const buildInfo = {
  hash:
    process.env.PULP_UI_COMMIT ||
    execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim(),
  date: execSync('date -I', { encoding: 'utf-8' }).trim(),
  version: require('../package.json').version,
};

const docsURL = 'https://docs.pulpproject.org/';

// Default user defined settings
const defaultConfigs = [
  // Global scope means that the variable will be available to the app itself
  // as a constant after it is compiled
  { name: 'API_BASE_PATH', default: '', scope: 'global' },
  { name: 'API_HOST', default: '', scope: 'global' },
  { name: 'APPLICATION_NAME', default: 'Pulp UI', scope: 'global' },
  { name: 'UI_BASE_PATH', default: '', scope: 'global' },
  { name: 'UI_BUILD_INFO', default: buildInfo, scope: 'global' },
  { name: 'UI_DOCS_URL', default: docsURL, scope: 'global' },
  { name: 'UI_EXTERNAL_LOGIN_URI', default: '/login', scope: 'global' },

  // Webpack scope: only available in customConfigs here, not exposed to the UI
  { name: 'UI_PORT', default: 8002, scope: 'webpack' },
  { name: 'UI_USE_HTTPS', default: false, scope: 'webpack' },
  { name: 'WEBPACK_PROXY', default: undefined, scope: 'webpack' },
  { name: 'WEBPACK_PUBLIC_PATH', default: undefined, scope: 'webpack' },
];

module.exports = (inputConfigs) => {
  const customConfigs = {};
  const globals = {};

  defaultConfigs.forEach((item) => {
    customConfigs[item.name] = inputConfigs[item.name] ?? item.default;
  });

  defaultConfigs
    .filter(({ scope }) => scope === 'global')
    .forEach((item) => {
      globals[item.name] = JSON.stringify(customConfigs[item.name]);
    });

  return {
    devtool: 'source-map',

    ...(isBuild
      ? {}
      : {
          devServer: {
            allowedHosts: 'all',
            client: { overlay: false },
            devMiddleware: { writeToDisk: true },
            historyApiFallback: true,
            host: '0.0.0.0',
            hot: false,
            liveReload: true,
            onListening: (server) =>
              console.log(
                'App should run on:',
                `${server.options.https ? 'https' : 'http'}://localhost:${
                  server.options.port
                }`,
              ),
            port: customConfigs.UI_PORT,
            proxy: Object.entries(customConfigs.WEBPACK_PROXY).map(
              ([k, v]) => ({
                context: [k],
                target: v,
              }),
            ),
            server: { type: customConfigs.UI_USE_HTTPS ? 'https' : 'http' },
            static: { directory: resolve(__dirname, '../dist') },
          },
        }),

    entry: { App: resolve(__dirname, '../src/entrypoint.tsx') },
    mode: isBuild ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /src\/.*\.(js|jsx|ts|tsx)$/,
          use: [{ loader: 'source-map-loader' }, { loader: 'babel-loader' }],
        },
        {
          test: /\.(css|scss|sass)$/,
          use: [
            isBuild ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(woff(2)?|ttf|jpg|png|eot|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: { filename: 'fonts/[name][ext][query]' },
        },
        { test: /\.mjs$/, include: /node_modules/, type: 'javascript/auto' },
      ],
    },
    output: {
      filename: 'js/[name].[fullhash].js',
      path: resolve(__dirname, '../dist'),
      publicPath: customConfigs.WEBPACK_PUBLIC_PATH ?? '/',
      chunkFilename: 'js/[name].[fullhash].js',
    },
    plugins: [
      // sourcemaps
      new webpack.SourceMapDevToolPlugin({
        exclude: /node_modules/,
        filename: 'sourcemaps/[name].[contenthash].js.map',
      }),
      // extract css in prod
      isBuild &&
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash].css',
        }),
      // clean dist/
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['**/*', '!index.html'],
      }),
      // define global vars
      new webpack.DefinePlugin(globals),
      // typescript check
      new ForkTsCheckerWebpackPlugin(),
      // inject src/index.html
      new HtmlWebpackPlugin({
        applicationName: customConfigs.APPLICATION_NAME,
        favicon: 'static/images/favicon.ico',
        template: resolve(__dirname, '../src/index.html'),
      }),
    ].filter(Boolean),
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        // imports relative to repo root
        src: resolve(__dirname, '../src'),
        static: resolve(__dirname, '../static'),
      },
    },
    watchOptions: {
      // ignore editor files when watching
      ignored: ['**/.*.sw[po]'],
    },
  };
};
