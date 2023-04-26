const path = require('path');

module.exports = {
  mode: 'production',
  entry: 'mermaid/dist/mermaid.core.mjs',
  output: {
    path: path.resolve(__dirname, 'public', 'mermaid'),
    filename: 'mermaid.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
