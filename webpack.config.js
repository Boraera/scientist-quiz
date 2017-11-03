let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.


module.exports = function createWebpackConfig() {
    return {
        entry: {
            app: ['./src/app.jsx']
        },
        output: {
            path: path.resolve(__dirname, 'build/bundle'),
            filename: 'js/[name].js'
        },
        resolve: {
            extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.tsx', '.css', '.jsx']
        },
        module: {
            rules: [
                // Load SCSS
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        use: ["css-loader", "sass-loader"],
                        fallback: "style-loader"
                    })
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: ["css-loader"],
                        fallback: "style-loader"
                    })
                },
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules)/,
                    use: {
                      loader: 'babel-loader'

                    }
                },
                {
                    test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                    use: 'file?name=images/[name].[ext]'
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: '[name].css',
                allChunks: true
            })
        ],
        // mock fs since this is a browser build, see https://github.com/josephsavona/valuable/issues/9
        node: {
            fs: 'empty'
        },
        devServer: {
            contentBase: '.',
            compress: true,
            port: 9000,
            historyApiFallback: {
                index: 'index.html'
            }
        },
        devtool: 'eval'
    };
}
