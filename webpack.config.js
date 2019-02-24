const merge = require('webpack-merge')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const nodeExternals = require('webpack-node-externals')

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
        test: /\.(sc|c)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        include: __dirname,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
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
  plugins: [new VueLoaderPlugin()]
}

module.exports = [
  merge(common, {
    entry: './plugin.ts',
    output: {
      filename: 'vue-time-picker.min.js',
      libraryTarget: 'window',
      library: 'TimePicker'
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
    externals: [nodeExternals()]
  })
]
