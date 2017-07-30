const webpack = require('webpack');

module.exports = {
  entry: './reactApp/app.js',
  output: {
    path: __dirname + '/build',
    filename: 'app.bundle.js',
    // publicPath: __dirname + '/public'
  },
  module: {
    rules: [
      {
        test: /reactApp\/(.)*\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[path][name].[hash].[ext]',
      //   },
      //   // use: ['url-loader']
      // }
      // {
        // test: /\.(jpe?g|png|gif|svg)$/i,
        // loader: "file-loader?name=public/[name].[ext]"
      // }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
