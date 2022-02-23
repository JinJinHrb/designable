import baseConfig from './webpack.base'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import MonacoPlugin from 'monaco-editor-webpack-plugin'
//import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import webpack from 'webpack'
import path from 'path'
import _ from 'lodash'

const PORT = 3000

/* const createPages = (pages) => {
  return pages.map(({ filename, template, chunk }) => {
    return new HtmlWebpackPlugin({
      filename,
      template,
      inject: 'body',
      chunks: chunk,
    })
  })
} */

/* if (_.isString(baseConfig.entry)) {
  const baseConfigEntryArray = [baseConfig.entry as string]
  baseConfigEntryArray.unshift(
    require.resolve('webpack/hot/dev-server'),
    `${require.resolve('webpack-dev-server/client')}?http://localhost:${PORT}`
  )
  baseConfig.entry = baseConfigEntryArray as any
} else if (_.isObject(baseConfig.entry)) {
  const baseConfigEntryObject = baseConfig.entry as any
  for (const key in baseConfigEntryObject) {
    if (Array.isArray(baseConfig.entry[key])) {
      ;(baseConfig.entry[key] as string[]).unshift(
        require.resolve('webpack/hot/dev-server'),
        `${require.resolve(
          'webpack-dev-server/client'
        )}?http://localhost:${PORT}`
      )
    }
  }
} */

export default {
  ...baseConfig,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    /* ...createPages([
      {
        filename: 'index.html',
        template: path.resolve(__dirname, './template.ejs'),
        chunk: ['playground'],
      },
    ]), */
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve(__dirname, './template.ejs'),
      minify: { collapseWhitespace: true },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MonacoPlugin({
      languages: ['json'],
    }),
    // new BundleAnalyzerPlugin()
  ],
  devServer: {
    host: '127.0.0.1',
    open: true,
    port: PORT,

    // 微服务改造 Start
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    liveReload: false,
    disableHostCheck: true,
    compress: true,
    hot: true,
    watchContentBase: false,
    // 微服务改造 End
  },
}
