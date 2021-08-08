const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack')

module.exports = {
    devtool: 'source-map',
    mode: process.env.NODE_ENV,
    entry: {
        base: path.resolve(__dirname, 'src/js/base.js'),
        index: path.resolve(__dirname, 'src/js/index.js'),
        create: path.resolve(__dirname, 'src/js/create.js'),
        read: path.resolve(__dirname, 'src/js/read.js'),
        update: path.resolve(__dirname, 'src/js/update.js'),
        delete: path.resolve(__dirname, 'src/js/delete.js'),
        transfer_a : path.resolve(__dirname, 'src/js/transfer-a.js'),
        transfer_b : path.resolve(__dirname, 'src/js/transfer-b.js'),
        status_create : path.resolve(__dirname, 'src/js/status-create.js'),
        update_transfer_a : path.resolve(__dirname, 'src/js/update-transfer-a.js'),
        update_transfer_b : path.resolve(__dirname, 'src/js/update-transfer-b.js'),
        status_success : path.resolve(__dirname, 'src/js/status-success.js'),
        read_transfer_a : path.resolve(__dirname, 'src/js/read-transfer-a.js'),
        read_transfer_b : path.resolve(__dirname, 'src/js/read-transfer-b.js'),
        admin_login : path.resolve(__dirname, 'src/js/admin-login.js'),
        admin : path.resolve(__dirname, 'src/js/admin.js'),
        admin_verify_a : path.resolve(__dirname, 'src/js/admin-verify-a.js'),
        admin_verify_b : path.resolve(__dirname, 'src/js/admin-verify-b.js'),
        base_admin : path.resolve(__dirname, 'src/js/base-admin.js'),
        _404 : path.resolve(__dirname, 'src/js/404.js'),
        register : path.resolve(__dirname, 'src/js/register.js'),
        user_login : path.resolve(__dirname, 'src/js/user-login.js'),
    },
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, 'src/')
        }
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/static/dist',
        filename: 'js/[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {loader: 'babel-loader'}
            },
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                    {loader: 'postcss-loader'},
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|jpe?g|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'img/[name].[ext]'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            disable: process.env.NODE_ENV === 'production' ? false : true,
                            mozjpeg: {
                                progressive: true,
                                quality: 65,
                            },
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.9],
                                speed: 4,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            webp: {
                                enabled: false,
                                quality: 75,
                            },
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template/base.html',
            filename: 'template/base.html',
            chunks: ['base']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/index.html',
            filename: 'template/index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/create.html',
            filename: 'template/create.html',
            chunks: ['create']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/read.html',
            filename: 'template/read.html',
            chunks: ['read']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/update.html',
            filename: 'template/update.html',
            chunks: ['update']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/delete.html',
            filename: 'template/delete.html',
            chunks: ['delete']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/transfer-a.html',
            filename: 'template/transfer-a.html',
            chunks: ['transfer_a']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/transfer-b.html',
            filename: 'template/transfer-b.html',
            chunks: ['transfer_b']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/status-create.html',
            filename: 'template/status-create.html',
            chunks: ['status_create']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/update-transfer-a.html',
            filename: 'template/update-transfer-a.html',
            chunks: ['update_transfer_a']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/update-transfer-b.html',
            filename: 'template/update-transfer-b.html',
            chunks: ['update_transfer_b']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/status-success.html',
            filename: 'template/status-success.html',
            chunks: ['status_success']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/read-transfer-a.html',
            filename: 'template/read-transfer-a.html',
            chunks: ['read_transfer_a']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/read-transfer-b.html',
            filename: 'template/read-transfer-b.html',
            chunks: ['read_transfer_b']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/admin.html',
            filename: 'template/admin.html',
            chunks: ['admin']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/admin-login.html',
            filename: 'template/admin-login.html',
            chunks: ['admin_login']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/admin-verify-a.html',
            filename: 'template/admin-verify-a.html',
            chunks: ['admin_verify_a']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/admin-verify-b.html',
            filename: 'template/admin-verify-b.html',
            chunks: ['admin_verify_b']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/base-admin.html',
            filename: 'template/base-admin.html',
            chunks: ['base_admin']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/404.html',
            filename: 'template/404.html',
            chunks: ['_404']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/register.html',
            filename: 'template/register.html',
            chunks: ['register']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/user-login.html',
            filename: 'template/user-login.html',
            chunks: ['user_login']
        }),
        new MiniCssExtractPlugin({
            filename: 'css/all.css'
        }),
        new webpack.ProvidePlugin({
            bootstrap: 'bootstrap/dist/js/bootstrap.bundle',
            $: 'jquery',
            jQuery: 'jquery',
        })
    ],
};