import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';

export default {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, 'dist'),
    library: {
      type: 'module',
    },
    globalObject: 'this',
  },
  experiments: {
    outputModule: true,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
        },
      }),
    ],
  },
};