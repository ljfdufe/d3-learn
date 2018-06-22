module.exports = {
    entry: __dirname + "/app/pie-tooltip.js",
    output: {
        path: __dirname + "/public",
        filename: "bundle.js"
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
        }]
    },

    devServer: {
        contentBase: "./public",
        historyApiFallback: true,
        inline: true,
    }
}