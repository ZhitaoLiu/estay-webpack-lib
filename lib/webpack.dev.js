const webpack = require('webpack');
const path = require('path');

const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const baseConfig = require('./webpack.base');
const rootDir = process.cwd();

const devConfig = {
  mode: 'development',

  devtool: 'eval-source-map',

  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
      },
      {
        test: /\.module\.less$/,
        exclude: /node_modules/,
        use: ['style-loader', { loader: 'css-loader', options: { modules: true } }, 'postcss-loader', 'less-loader'],
      },

      {
        test: /\.(png|jpe?g|gif|webp)$/,
        exclude: /node_modules/,
        use: 'file-loader',
      },
    ],
  },

  devServer: {
    port: 8080,
    contentBase: './dist',
    open: true,
    hot: true,
    progress: true, // 显示打包的进度条
    compress: true, // 启动 gzip 压缩
    proxy: {},
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, './src/public/dev-index.html'),
    }),

    // 热更新
    new webpack.HotModuleReplacementPlugin(),

    // 预编译资源
    new webpack.DllReferencePlugin({
      manifest: require('./dist/library.manifest.json'),
    }),

    // 缓存构建文件
    new HardSourceWebpackPlugin(),

    // 简化控制台输出
    new FriendlyErrorsWebpackPlugin({}),
  ],

  stats: 'errors-warnings',
};

module.exports = merge(baseConfig, devConfig);
