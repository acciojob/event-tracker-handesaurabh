const path = require("path");
const webpack = require('webpack'); // Add this import
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => { // Accept env/argv from CLI
    const isTest = argv.mode === 'test'; // Detect test mode

    return {
        mode: isTest ? 'test' : 'development', // Set mode explicitly
        entry: './src/index.js',
        output: {
            path: path.join(__dirname, "/dist"),
            filename: "index_bundle.js",
        },
        module: {
            rules: [
                {
                    test: /\.js$|\.jsx$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        { loader: 'style-loader' },
                        { loader: 'css-loader' }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html"
            }),
            // Define NODE_ENV globally for React
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(isTest ? 'test' : 'development')
            })
        ],
        resolve: {
            extensions: ['.js', '.jsx']
        },
        devServer: { // Add devServer for npm start
            port: 3000,
            open: true,
            hot: true,
            static: path.join(__dirname, 'dist')
        },
        node: {
            crypto: 'empty',
            stream: 'empty'
        }
    };
};
