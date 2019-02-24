const merge = require('webpack-merge')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const common = {
  output: {
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
    ]
  },
  resolve: {
    extensions: [ '.ts', '.ts', '.js', '.vue' ]
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'production'
  },
  mode: process.env.NODE_ENV,
  plugins: [
    new VueLoaderPlugin(),
    new BundleAnalyzer({ analyzerMode: 'static', defaultSizes: 'parsed', openAnalyzer: false }),
  ]
}

module.exports = [
  merge(common, {
    entry: './plugin.ts',
    output: {
      filename: 'vue-time-picker.min.js',
      libraryTarget: 'window',
      library: 'TimePicker'
    },
    module: {
      rules: [{
        test: /\.(sc|c)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }]
    }
  }),
  merge(common, {
    entry: './time-picker.vue',
    output: {
      filename: 'vue-time-picker.js',
      libraryTarget: 'umd',
      library: 'vue-time-picker',
      umdNamedDefine: true
    },
    externals: [nodeExternals()],
    module: {
      rules: [{
        test: /\.(sc|c)ss$/,
        use: [
          process.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader
            : 'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }]
    },
    plugins: process.env.NODE_ENV === 'production' ? [
      new MiniCssExtractPlugin({ filename: 'styles.[hash].css' })
    ] : []
  })
]
