import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

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
  plugins: [
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
    }),
  ],
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