var webpack = require('webpack'),
    path = require('path');

module.exports = {
    entry: {
        demo: './demo'
    },
    output: {
        path: path.resolve(__dirname, './demo'),
        publicPath: '/',
        filename: '[name].js'
    },
    module: {
        loaders: [{
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    },
    vue: {
        loaders: {
            scss: 'style!css!sass'
        }
    },
    devtool: '#eval-source-map',
    devServer: {
        port: '8080',
        contentBase: path.resolve(__dirname, 'demo/'),
        inline: true,
        noInfo: false,
        hot: false,
        stats: {
            cached: false,
            exclude: [/node_modules[\\\/]/],
            colors: true
        }
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        alias : {
            'vue$':'vue/dist/vue.js'
        }
    }
    plugins: []
}