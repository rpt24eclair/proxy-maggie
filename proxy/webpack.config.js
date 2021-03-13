const path = require('path');
var DIST_DIR = path.join(__dirname, '/public');
const axios = require('axios');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: [
    //"../../somebirdsColorAndSizeSelection/client/index.jsx",
    //"../somebirds-product-accordion/client/index.jsx",
    //"../somebirds-product-images/client/index.jsx",
    //"../somebirdsReviews/client/index.jsx",
    "../../somebirdsNavBar/client/index.jsx",
    "../../somebirdsFooter/client/index.jsx"
  ],
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ['@babel/preset-react', '@babel/preset-env']
        }
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      }
    ]
  },
  output: {
    path: DIST_DIR,
    filename: 'bundles.js'
  },
  // plugins: [
  //   new webpack.DefinePlugin({
  //     'process.env': {
  //       'NODE_ENV': JSON.stringify('production')
  //     }
  //   }),
  //   new webpack.optimize.DedupePlugin(),
  //   new webpack.optimize.UglifyJsPlugin(),
  //   new webpack.optimize.AggressiveMergingPlugin(),
  //   new CompressionPlugin({
  //     asset: "[path].gz[query]",
  //     algorithm: "gzip",
  //     test: /\.js$|\.css$|\.html$/,
  //     threshold: 10240,
  //     minRatio: 0.8
  //   })
  // ],
  plugins: [ new CompressionPlugin ],
  mode: "development",
}