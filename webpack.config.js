const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: [
        './src/js/main.js',
        './src/css/main.css',
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: "./index.html" // index.html을 기본 템플릿으로 반영할 수 있도록 설정
    }),     
    new CopyWebpackPlugin({
        patterns: [
            { from: "./images", to: "images" },
            { from: "./video", to: "video" },
          ],
        }),
    ],
    devServer: {
        static: {
          directory: path.resolve(__dirname, 'dist')
        },
        port: 3800
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            options: {
                name: '[name].[ext]',
            },
            loader: "script-loader"
          }
        },
        {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
        },
        // file-loader 세팅
      {
        test: /\.(png|jpe?g|gif|svg|webp|JPG|ico)$/i,
        use: [
            {
                loader: 'file-loader',
                options: {
                    outputPath: 'img/',
                    name: '[name].[ext]',
              }
            }
          ]
        }
      ]}
}
