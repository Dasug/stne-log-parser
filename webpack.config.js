import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';

export default {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, 'dist'),
    library: {
      name: 'stneLogParser',
      type: 'umd',
    },
    globalObject: 'this',
  },
  externals: {
    enumify: {
      commonjs: 'enumify',
      commonjs2: 'enumify',
      amd: 'enumify',
      root: 'Enumify',
    },
    regex: {
      commonjs:'regex',
      commonjs2: 'regex',
      amd: 'regex',
      root: 'Regex',
    }
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