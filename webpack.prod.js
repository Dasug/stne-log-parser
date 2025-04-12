import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
  mode: 'production',
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
});