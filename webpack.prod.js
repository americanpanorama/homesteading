const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const appDir = path.resolve(__dirname, 'build');

module.exports = merge({
  devtool: false,
  output: {
    path: appDir,
    filename: 'index.js',
    publicPath: '/panorama/homesteading'
  },
  optimization: {
    minimizer: [new TerserPlugin({
      sourceMap: true,
    })]
  },
  plugins: [
    new webpack.DefinePlugin({
      //'process.env.NODE_ENV': JSON.stringify('production')
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        PUBLIC_URL: JSON.stringify('/panorama/homesteading')
      }
    }),
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
        //   href:  '/panorama/photogrammar/favicon.ico'
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
        //   content: 'https://dsl.richmond.edu/socialvulnerability/'
        // },
        // {
        //   property: 'og:title',
        //   content: 'Not Even Past: Social Vulnerability and the Legacy of Redlining'
        // },
        // {
        //   property: 'og:description',
        //   content: 'Not Even Past maps redlining maps from the 1930s with maps of health dispartities today, showing enduring contours of marked inequality in American cities over the past century.'
        // },
        // {
        //   property: 'og:image',
        //   content: 'https://dsl.richmond.edu/socialvulnerability/images/ogimage.jpg'
        // },
        // {
        //   property: 'og:image:width',
        //   content: '1200'
        // },
        // {
        //   property: 'og:image:height',
        //   content: '630'
        // }
      ]
    }),
  ]
}, common);
