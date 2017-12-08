
process.chdir(process.env.ROOT_PATH)
console.log(`Working directory was changed to: ${process.cwd()}`)

import gulp from 'gulp'
import gutil from 'gulp-util'
import gulpSync from 'gulp-sync'
import del from 'del'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackConfig from './webpack.config.js'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { default as jest } from 'gulp-jest'
import fs from 'fs'

/* var svgmin = require('gulp-svgmin');
gulp.task('default', function () {
    return gulp.src('logo.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('./out'));
});
https://github.com/svg/svgo
*/

console.error('Don t forget to svg bundle and minify')

const sync = gulpSync(gulp).sync

console.log('Started in ', process.env.NODE_ENV, ' mode')
/**
 * client:build
 *
 * Builds the client code from src/client to dist/client
 * Uses webpack to compile the code.
 */
gulp.task('client:build', (done) => {

  webpackConfig.plugins.push(new HtmlWebpackPlugin({
    inject: false,
    template: `${process.env.CLIENT_PATH}/assets/index.ejs`,
    mobile: true,
    baseHref: process.env.HOST_IP,
    appMountId: process.env.ROOT_ELEMENT_ID,
    title: process.env.APP_TITLE,
    hash: true
  }))

  webpack(webpackConfig).run(x => done())
  gulp.src(`${process.env.CLIENT_PATH}/assets/favicon/*`)
    .pipe(gulp.dest(`${process.env.DIST_PATH}/favicon`))

  gulp.src( `${process.env.CLIENT_PATH}/assets/images/*`)
    .pipe(gulp.dest(`${process.env.DIST_PATH}/images`))

})

gulp.task('clean', () => del([`${process.env.DIST_PATH}/*`]))

/* client:dev */
gulp.task('client:start', () => {
  webpackConfig.plugins.push(new HtmlWebpackPlugin({
    inject: false,
    template: `${process.env.CLIENT_PATH}/assets/index.ejs`,
    mobile: true,
    baseHref: process.env.HOST_IP,
    appMountId: process.env.ROOT_ELEMENT_ID,
    devServer: `http://${process.env.HOST_IP}:${process.env.HOST_PORT}`,
    title: process.env.APP_TITLE,
    hash: true
  }))

  webpackConfig.devServer = {
    historyApiFallback: true,
    contentBase: `${process.env.CLIENT_PATH}/assets`,
    hot: true,
    inline: true,
    stats: 'errors-only',
    port: process.env.HOST_PORT,
    host: process.env.HOST_IP,
  }

  let compiler = webpack(webpackConfig)
  let server = new WebpackDevServer(compiler, webpackConfig.devServer)
  let port = webpackConfig.devServer.port
  let host = webpackConfig.devServer.host

  let fn = err => {
    if(err) throw new gutil.PluginError("webpack-dev-server", err)
    gutil.log("[webpack-dev-server]", "http://" + host + ":" + port)
  }

  server.listen(port, host, fn)
})

gulp.task('tests:unit', () => {
   return gulp.src(`${process.env.TEST_UNIT_PATH}/*.js`).pipe(jest({
    config: {
      testRegex: process.env.JEST_TEST,
      testEnvironment: process.env.JEST_ENVIRONMENT,
      collectCoverage: ('true' == process.env.JEST_COVERAGE)
    }
  }))
})

gulp.task('tests:perf', done => {
  let files = fs.readdirSync(process.env.TEST_PERF_PATH)
  files.forEach(x => {
    if (x.indexOf('.js') === -1) {
      return
    }
    let suite = require(process.env.TEST_PERF_PATH + '/' + x)
    suite
      .on('error', x => {
        console.log('Benchmark encountered an error', x)
      })
      .on('start', x => {
        console.log('Started benchmark...')
      })
      .on('cycle', function(event) {
        console.log(String(event.target));
      })
      .on('complete', function () {
        // console.log('Fastest is ' + this.filter('fastest').map('name'))
        done()
      })
      .run({
        async: true
      })
  })
})

/* build */
gulp.task('build:app', sync(['clean', 'client:build']))
gulp.task('start:app', ['client:start'])
gulp.task('start:test', ['tests:unit', 'tests:perf'])
