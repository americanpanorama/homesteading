const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const appDir = path.resolve(__dirname, 'build');

module.exports = merge({
  devtool: 'inline-source-map',
  output: {
    path: appDir,
    filename: 'index.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: appDir,
    historyApiFallback: true,
    port: 9000
  },
  plugins: [
    //new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      //'process.env.NODE_ENV': JSON.stringify('production')
      'process.env.PUBLIC_URL': JSON.stringify('')
    }),
   // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      template: require('html-webpack-template'),
      title: 'Homesteading',
      filename: 'index.html',
      appMountId: 'app-container',
      links: [
        {
          href: 'https://fonts.googleapis.com',
          rel: 'preconnect'
        },
        {
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display&family=Roboto+Condensed:wght@300;400&family=Titillium+Web:ital,wght@1,200&display=swap',
          rel: 'stylesheet'
        },
        {
          rel: 'icon',
          href: 'http://dsl.richmond.edu/assets/images/favicon.png'
        }
        // {
        //   rel: 'alternate icon',
        //   href:  './favicon.ico'
        // }
      ],
      // googleAnalytics: {
      //   trackingId: 'UA-4063620-22',
      //   pageViewOnLoad: true
      // },
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        }
        // {
        //   property: 'og:url',
        //   content: 'https://dsl.richmond.edu/panorama/redlining/'
        // },
        // {
        //   property: 'og:title',
        //   content: 'Mapping Inequality'
        // },
        // {
        //   property: 'og:description',
        //   content: 'Redlining in New Deal America'
        // },
        // {
        //   property: 'og:image',
        //   content: 'https://dsl.richmond.edu/panorama/redlining/static/ogimage.png'
        // },
        // {
        //   property: 'og:image:width',
        //   content: '1200'
        // },
        // {
        //   property: 'og:image:height',
        //   content: '630'
        // }
      ],
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      disable: process.env.NODE_ENV === 'development'
    })
  ],
}, common);
