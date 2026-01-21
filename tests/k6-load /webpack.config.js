const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    outsera: path.resolve(
      __dirname,
      "./src/simulations/loadPerformanceOutsera.test.js",
    ),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs",
    filename: "[name].test.js",
  },
  module: {
    rules: [{ test: /\.js$/, use: "babel-loader", exclude: /node_modules/ }],
  },
  target: "web",
  externals: /k6(\/.*)?/,
  plugins: [new CleanWebpackPlugin.CleanWebpackPlugin()],
};
