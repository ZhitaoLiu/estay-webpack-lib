const path = require('path');
const webpack = require('webpack');
const rootDir = process.cwd();

const dllConfig = {
  mode: 'production',
  entry: {
    library: ['react', 'react-dom'],
  },
  output: {
    filename: '[name].dll.js',
    path: path.join(rootDir, 'dist'),
    library: '_dll_[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      name: '_dll_[name]',
      path: path.join(rootDir, 'dist/[name].manifest.json'),
    }),
  ],
};

module.exports = dllConfig;
