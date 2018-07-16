var webpack = require("webpack");


module.exports = {
    entry: __dirname + "/app/Heatmap (2D Histogram, CSV).js",
    output: {
        path: __dirname + "/public",
        filename: "bundle.js",
        // publicPath:"http://localhost:8000/public/"
    },

    mode: 'development',

    module: {
        rules: [{
            test: /\.css$/,
            use: [
                {
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }
            ],
            exclude: /node_modules/,
        },{
            test: /\.sass$/,
            use: [
                {
                    loader: "sass-loader"
                }
            ],
            exclude: /node_modules/,
        }]
    },

    devServer: {
        contentBase: "./public",
        historyApiFallback: true,
        inline: true,
    },

    // plugins:{
    //     // new webpack.SourceMapDevToolPlugin()
    // }
}