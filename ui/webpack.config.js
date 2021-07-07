const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

const isDevelopmentBuild = process.env.NODE_ENV !== 'production';
const devServer = isDevelopmentBuild ? {
    // contentBase: path.join(__dirname, 'dist'),
    // compress: true,
    port: 9000,
} : undefined;

module.exports = {
  devServer,
  entry: {
    "main": "./ui/index.js",
  },
  output: {
    path: isDevelopmentBuild ? path.join(__dirname, '..', 'app', 'assets'): path.join(__dirname, 'dist'),
    filename: "react-app-bundle.js"
  },
  mode: isDevelopmentBuild ? "development" : "production",
  optimization: {
    minimize: !isDevelopmentBuild
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader'
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
        use: ['url-loader']
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './ui/index.html',
      inlineSource: '.(js|css)$'
    }),
    new HtmlWebpackInlineSourcePlugin()
  ]
}
