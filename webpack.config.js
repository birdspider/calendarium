const webpack = require('webpack')
const path = require('path')
const pkg = require('./package.json')
const compress = require('compression')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const year = new Date().getFullYear()
const contribs = ([pkg.author].concat(pkg.contributors || [])).map(c => c.name || '').join(', ')

const banner = `${pkg.name} - v${pkg.version}\n${pkg.homepage}\nCopyright (c) ${year} ${contribs}\nLicensed under the ${pkg.license}`

let bSync = new BrowserSyncPlugin({
  host: 'localhost',
  port: 3000,
  server: {
    baseDir: ['.'],
    middleware: [compress()]
  },
  files: ['demo/*.*', 'src/*.*'],
  notify: false,
  startPath: '/demo'
})

let outputFile

module.exports = env => {
  let mode = env.prod ? 'production' : 'development'

  let plugins = []

  if (env.prod) {
    outputFile = '[name].min.js'
    plugins.push(new webpack.BannerPlugin(banner))

    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
      .BundleAnalyzerPlugin
    plugins.push(new BundleAnalyzerPlugin())
  } else {
    outputFile = '[name].js'
    plugins.push(bSync)
  }

  plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].[id].css'
    })
  )

  plugins.push(
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(env.prod),
      LOG: JSON.stringify(!env.prod)
    })
  )

  plugins.push(
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  )

  let devtool = env.prod ? {} : { devtool: 'cheap-module-eval-source-map' }
  let publicPath = '/build/'

  let config = {
    entry: {
      'calendarium': './src/js/calendarium.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist/'),
      publicPath,
      filename: outputFile,
      chunkFilename: env.prod
        ? 'calendarium.[name].min.js'
        : 'calendarium.[name].js',
      sourceMapFilename: '[file].map',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    module: {
      rules: [
        {
          test: /(\.jsx|\.js)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }]],
              plugins: [
                '@babel/plugin-transform-runtime'
              ]
            }
          },
          exclude: /(node_modules|bower_components)/
        },
        {
          test: /(\.jsx|\.js)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'compressed',
                omitSourceMapUrl: true
              }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
          use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
        }
      ]
    },
    resolve: {
      modules: [path.resolve('./node_modules'), path.resolve('./src')],
      extensions: ['.json', '.js', '.css'],
      mainFiles: ['index']
    },
    plugins: plugins,
    mode: mode,
    optimization: {
      usedExports: true
    },
    externals: {
      jquery: 'jQuery'
    }
  }

  return env.prod ? config : { ...config, ...devtool }
}
