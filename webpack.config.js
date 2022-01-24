const {merge} = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');

const commonConfig = {
  entry: {
    extension: {
      import: './src/background.ts',
      filename: 'background.js',
    },
    devtools: {
      import: './src/devtools/devtools.ts',
      filename: 'devtools/devtools.js',
    },
    idePanel: {
      import: './src/devtools/idePanel/idePanel.tsx',
      filename: 'devtools/idePanel/idePanel.js',
    },
    sandbox: {
      import: './src/devtools/sandbox/sandbox.ts',
      filename: 'devtools/sandbox/sandbox.js',
    },
    'editor.worker': {
      import: 'monaco-editor/esm/vs/editor/editor.worker.js',
      filename: 'devtools/idePanel/editor.worker.js',
    },
    'ts.worker': {
      import: 'monaco-editor/esm/vs/language/typescript/ts.worker.js',
      filename: 'devtools/idePanel/ts.worker.js',
    },
  },
  output: {
    clean: true,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.d.ts$/,
        type: 'asset/source',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /(node_modules|typedefs)/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      // stream: require.resolve('stream-browserify'),
      // path: require.resolve('path-browserify'),
      // zlib: require.resolve('browserify-zlib'),
      // crypto: require.resolve('crypto-browserify'),
      // http: require.resolve('stream-http'),
      // https: require.resolve('https-browserify')
      stream: false,
      path: false,
      zlib: false,
      crypto: false,
      http: false,
      https: false,
      net: false,
      tls: false,
      fs: false,
      bufferutil: false,
      'utf-8-validate': false,
    },
  },
};

const devConfig = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
};

const prodConfig = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            reserved: ['getElementSelector'],
          },
        },
      }),
    ],
  },
};

module.exports =
  process.env.NODE_ENV === 'production'
    ? merge(commonConfig, prodConfig)
    : merge(commonConfig, devConfig);
