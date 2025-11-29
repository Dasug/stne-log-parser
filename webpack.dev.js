import path from 'path';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
   devServer: {
    static: {
      directory: path.resolve(import.meta.dirname, 'public'),
    },
    hot: false,
  },
});
