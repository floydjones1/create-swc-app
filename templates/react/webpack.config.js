const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ESBuildMinifyPlugin } = require("esbuild-loader");
const swcconf = require("./swc.config.json");

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash].js",
    chunkFilename: "js/[name].[contenthash].js",
    assetModuleFilename: "assets/[hash][ext][query]",
  },
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: "es2015",
        css: true,
      }),
    ],
    splitChunks: {
      chunks: "all",
    },
  },
  devtool: "source-map",
  resolve: {
    extensions: [".mjs", ".js", ".jsx"],
  },
  devServer: {
    contentBase: "./dist",
    port: 3000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "esbuild-loader",
            options: {
              loader: "css",
              minify: true,
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(js|mjs|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
          options: swcconf,
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: false,
      template: "./public/index.html",
    }),
  ],
};
