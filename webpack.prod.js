const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDir = path.resolve(__dirname, 'build');
const rawBuildPublicUrl = process.env.BUILD_PUBLIC_URL || '/';
const normalizedBuildPublicUrl = rawBuildPublicUrl === '/'
  ? '/'
  : rawBuildPublicUrl.replace(/\/+$/, '');
const runtimePublicUrl = normalizedBuildPublicUrl === '/' ? '' : normalizedBuildPublicUrl;
const public_url = '/panorama/homesteading';

module.exports = merge({
    devtool: false,
    output: {
        path: appDir,
        filename: 'index.js',
        publicPath: public_url,
        clean: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            //'process.env.NODE_ENV': JSON.stringify('production')
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                PUBLIC_URL: JSON.stringify(public_url)
            }
        }),
        new HtmlWebpackPlugin({
            inject: 'body',
            template: path.resolve(__dirname, 'public/index-webpack.html'),
            title: 'Homesteading',
            filename: 'index.html'
        }),
    ]
}, common);
