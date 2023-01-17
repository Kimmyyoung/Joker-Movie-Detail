const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  // 여기에 설정
  plugins: [new HtmlWebpackPlugin({
    template: "./index.html" // index.html을 기본 템플릿으로 반영할 수 있도록 설정
  })]
}
