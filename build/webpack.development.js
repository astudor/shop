import webpack from 'webpack'
import { Config } from 'webpack-config'

const envVars = {
  'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
  'process.env.APP_TITLE': `"${process.env.APP_TITLE}"`,
  'process.env.ROOT_VIEW': `"${process.env.ROOT_VIEW}"`,
  'process.env.ROOT_ELEMENT_ID': `"${process.env.ROOT_ELEMENT_ID}"`,
  BASE_URL: `"${process.env.BASE_URL}"`,
  BASE_PATH: `"${process.env.BASE_PATH}"`
}

let exclude
if (process.env.NODE_ENV === 'development') {
  exclude = /node_modules/
} else {
  exclude = /^asdfwerqweasd$/
}

const conf = new Config()
  .extend('./webpack.base.js')
  .merge({
    node: {
      fs: 'empty'
    },
    filename: __filename,
    devtool: 'source-map',
    output: {
      path: process.env.DIST_PATH,
      pathinfo: true,
      publicPath: '/'
    },
    entry: {
      server: [
        `webpack-dev-server/client?http://${process.env.HOST_IP}:${process.env.HOST_PORT}`,
        'webpack/hot/dev-server'
      ],
      app: [
         `${process.env.CLIENT_PATH}/app`
      ]
    },
    resolve: {
      alias: {
        'lib': process.env.LIB_PATH,

        'controllers': `${process.env.CLIENT_PATH}/controllers`,
        'models': `${process.env.CLIENT_PATH}/models`,
        'views': `${process.env.CLIENT_PATH}/views`,

        'model': `${process.env.CLIENT_PATH}/model`,
        'db': `${process.env.CLIENT_PATH}/db`,
        'controller': `${process.env.CLIENT_PATH}/controller`,
        'view': `${process.env.CLIENT_PATH}/view`,

        'schema': `${process.env.SCHEMA_PATH}`,
        'data': `${process.env.DATA_PATH}`,

        'assets': `${process.env.CLIENT_PATH}/assets`,
        'css': `${process.env.CLIENT_PATH}/assets/css`,
        'fonts': `${process.env.CLIENT_PATH}/assets/fonts`,
        'js': `${process.env.CLIENT_PATH}/assets/js`,
        'images': `${process.env.CLIENT_PATH}/assets/images`
      },
      extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.css', '.tag', '.yml', '.yaml']
    },
    plugins: [
      new webpack.DefinePlugin(envVars),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
      new webpack.LoaderOptionsPlugin({
        debug: true
      })
    ],
    module: {
      rules: [
        { test: /\.js$/, exclude: exclude, loader: 'babel-loader',
          query: {
            presets: ['es2015'],
            plugins: [
              'add-module-exports',
              'transform-pug-html'
            ]
          }
        }
      ]
    }
  })

module.exports = conf