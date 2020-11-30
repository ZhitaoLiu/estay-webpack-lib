const path = require('path');

const cssnano = require('cssnano');
const { merge } = require('webpack-merge');

const TerserPlugin = require('terser-webpack-plugin');
// css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin'); // Gizp压缩

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 体积分析
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin'); // 速度分析
const smp = new SpeedMeasurePlugin();

const baseConfig = require('./webpack.base');
const rootDir = process.cwd();

// const glob = require('glob');
// const PurgeCSSPlugin = require('purgecss-webpack-plugin');
// const PATHS = {
//     src: path.join(rootDir, 'src')
// }

const prodConfig = {
  mode: 'production',

  output: {
    path: path.resolve(rootDir, './dist'),
    filename: '[name]_[chunkhash:8].js',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },

      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
      },

      {
        test: /\.module\.less$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { modules: true } },
          'postcss-loader',
          'less-loader',
        ],
      },

      {
        test: /\.(png|jpe?g|gif|webp)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              name: '[name]_[contenthash:8].[ext]',
              outputPath: './img/',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, './src/public/pro-index.html'),
    }),
    // 清除dist目录
    new CleanWebpackPlugin(),
    // 抽离css
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    // remove unuse css
    // 方案一: purgecss-webpack-plugin
    // new PurgeCSSPlugin({
    //     paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    // }),
    // 方案二: 如用 css module 或者 styles-components, 可改用 fullhuman/postcss-purgecss + cssnano
    // css 压缩
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
    }),
    // 静态资源预加载
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'allChunks',
    }),

    // 基础库分离cdn
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://cdn.bootcdn.net/ajax/libs/react/17.0.0-rc.3/umd/react.production.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.0-rc.3/umd/react-dom.production.min.js',
          global: 'ReactDOM',
        },
      ],
    }),

    // 开启Gzip压缩
    new CompressionPlugin(),

    // 体积分析
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
  ],

  // 配置优化项
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true, // 开启缓存
        parallel: true, // 多进程压缩
      }),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        // 公共的模块
        commons: {
          name: 'commons',
          priority: 0,
          minSize: 0,
          minChunks: 2,
        },
        // 第三方模块
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 1,
          minSize: 0,
        },
      },
    },
  },
};

module.exports = smp.wrap(merge(baseConfig, prodConfig));
