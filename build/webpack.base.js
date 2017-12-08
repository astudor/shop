import path from 'path'
import text from 'extract-text-webpack-plugin'
import { Config } from 'webpack-config'
import webpack from 'webpack'

const exclude = /node_modules/

let replaceVars = [
  'FIREBASE_APIKEY',
  'FIREBASE_AUTHDOMAIN',
  'FIREBASE_DATABASEURL',
  'FIREBASE_PROJECTID',
  'FIREBASE_STORAGEBUCKET',
  'FIREBASE_MESSAGINGSENDERID',
  'FIREBASE_NAMESPACE'
]

let replaceLoaders = replaceVars.map(x => {
  return 'string-replace-loader?' + JSON.stringify({
    search: '\\$\\{' + x + '\\}',
    replace: process.env[x],
    flags: 'g'
  })
})

replaceLoaders = ['json-loader', 'yaml-loader'].concat(replaceLoaders)

module.exports = new Config().merge({
  output: {
    filename: '[name].js'
  },
  resolve: {
    modules: [
      process.env.CLIENT_PATH,
      'node_modules'
    ]
  },
  plugins: [
    new text('[name].css')
  ],
  module: {
    rules: [
      { enforce: 'pre', test: /\.yml|\.yaml$/, exclude: exclude, loaders: replaceLoaders },
      { enforce: 'pre', test: /\.json$/, loader: 'json-loader' },
      { enforce: 'pre', test: /\.png$/, loader: 'url-loader?limit=5000' },
      { enforce: 'pre', test: /\.css$/, exclude: /node_modules(?!\/framework7)(?!\/flatpickr)(?!\/bulma)(?!\/materialize)|global\.css/,
          use: [
            'style-loader',
             {
                loader: 'css-loader',
                options: { importLoaders: 1 }
             },
             {
                loader: 'postcss-loader',
                options: {
                  plugins: (loader) => ([
                    require('postcss-color-alpha'),
                    require('postcss-strip-inline-comments'),
                    require('postcss-color-function'),
                    require('postcss-mixins'),
                    require('postcss-smart-import'),
                    require('autoprefixer'),
                    require('precss'),
                    require('postcss-easing-gradients')
                  ])
                }
             }
          ]
      },
      { enforce: 'pre', test: /\.jpg$/, exclude: exclude, loader: 'url-loader?prefix=img/&limit=5000' },
      { enforce: 'pre', test: /\.gif$/, exclude: exclude, loader: 'url-loader?prefix=img/&limit=5000' },
      { enforce: 'pre', test: /\.woff/, loader: 'url-loader?prefix=font/&limit=5000' },
      { enforce: 'pre', test: /\.woff2/, loader: 'url-loader?prefix=font/&limit=5000' },
      { enforce: 'pre', test: /\.eot/, loader: 'file-loader?prefix=font/' },
      { enforce: 'pre', test: /\.ttf/, loader: 'file-loader?prefix=font/' },
      { enforce: 'pre', test: /\.svg/, loader: 'file-loader?prefix=font/' },
      { enforce: 'pre', test: /\.pug$/, loader: 'jsonmvc-pug-view-loader' },
      { enforce: 'pre', test: /\.html$/, loader: 'html-loader', query: { minimize: true } },
       {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      }
      /*
      {
        test: /\.s[ac]ss$/,
        use: [{
            loader: "style-loader"
        }, {
            loader: "css-loader"
        }, {
            loader: "sass-loader"
        }]
      }
      */
    ]
  }
})
