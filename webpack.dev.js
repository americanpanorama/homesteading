const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDir = path.resolve(__dirname, 'build');
const publicDir = path.resolve(__dirname, 'public');

module.exports = merge({
    devtool: 'inline-source-map',
    output: {
        path: appDir,
        filename: 'index.js',
        publicPath: '/'
    },
    devServer: {
        static: [
            { directory: appDir },
            { directory: publicDir },
        ],
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
            inject: 'body',
            template: path.resolve(__dirname, 'public/index-webpack.html'),
            title: 'Land Acquisition and Dispossession',
            filename: 'index.html',
        }),
    ],
}, common);
