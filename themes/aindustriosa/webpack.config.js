const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    main: ['./src/scss/theme.scss', './src/js/main.js'],
    polyfill: '@babel/polyfill',
  },
  output: {
    path: path.resolve(__dirname, 'source')
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCSSExtractPlugin({
      filename: 'css/theme.css'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        GENERATED_JSON_PATH: 'phpvigo.json'
      },
    })
  ],
  resolve: {
    extensions: [ '.js', '.vue' ],
    alias: {
      'vue$': process.env.NODE_ENV === 'production' ? 'vue/dist/vue.runtime.min.js' : 'vue/dist/vue.runtime.js',
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.(sc|c)ss$/,
        use: [
          {
            loader:MiniCSSExtractPlugin.loader,
            options: {
              hmr: true //process.env.NODE_ENV === 'development',
            }
          },
          // {
          //   loader: 'file-loader',
          //   options: {
          //     name: 'css/[name].css',
          //   }
          // },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')]
            }
          },
          {
            loader: 'resolve-url-loader',
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: url => '../fonts/' + url
            }
          },
        ]
      }
    ]
  }
};
