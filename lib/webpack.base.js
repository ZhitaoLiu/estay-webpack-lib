const path = require('path');

const rootDir = process.cwd();

const baseConfig = {
  entry: path.resolve(rootDir, './src/index.js'),

  output: {
    path: path.resolve(rootDir, './dist'),
    filename: '[name].[chunk:8].js',
  },

  resolve: {
    modules: [path.resolve(rootDir, 'node_modules')], // 缩小文件搜索范围
    alias: {
      '@': path.resolve(rootDir, './'),
      'pages': path.resolve(rootDir, './src/pages'),
      'components': path.resolve(rootDir, './src/components'),
      'assets': path.resolve(rootDir, './src/assets'),
    },
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          // 多进程并行解析
          {
            loader: 'thread-loader',
            options: {
              workers: 2,
            },
          },
          {
            loader: 'babel-loader?cacheDirectory=true', // 开启缓存
            options: {},
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader',
      },
    ],
  },
};

module.exports = baseConfig;
