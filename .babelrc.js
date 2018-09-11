const path = require('path');

module.exports = {
  presets: [['env', { modules: false }], 'es2015', 'react', 'stage-2'],

  env: {
    test: {
      presets: ['env', 'react', 'stage-2'],
    },
  },

  plugins: [
    'babel-plugin-add-module-exports',
    'lodash',
    'syntax-dynamic-import',
    'transform-runtime',
    'transform-decorators-legacy',

    [
      'module-resolver',
      {
        alias: {
          components: path.join(__dirname, './src/components'),
        },
      },
    ],
    [
      'import',
      {
        libraryName: 'antd',
        style: true, // or 'css'
      },
    ],
  ],
};
