const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const GasPlugin = require("gas-webpack-plugin");

const destination = path.resolve(__dirname, "dist");
const isProduction = process.env.NODE_ENV === "production";

const getSrcPath = (filePath) => {
  const src = path.resolve(__dirname, "src");
  return path.posix.join(src.replace(/\\/g, "/"), filePath);
};

module.exports = {
  mode: isProduction ? "production" : "none",
  context: __dirname,
  entry: getSrcPath("/index.ts"),
  output: {
    filename: `code.[contenthash].js`,
    path: destination,
    libraryTarget: "this",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 6,
          warnings: false,
          mangle: {},
          compress: {
            drop_console: false,
            drop_debugger: isProduction,
          },
          output: {
            beautify: !isProduction,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          cache: true,
          failOnError: false,
          fix: true,
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: getSrcPath("../appsscript.json"),
          to: destination,
        },
      ],
    }),
    new GasPlugin(),
  ],
};
