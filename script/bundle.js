const { fork } = require('child_process');

const isProduction = process.env.NODE_ENV === 'production';
const command = isProduction ? 'build' : 'watch';

fork('./node_modules/parcel-bundler/bin/cli.js', [
  command,
  'src/graphics/*.html',
  '--out-dir',
  'graphics',
  '--public-url',
  '.',
  isProduction ? '--no-minify':'',
]);

fork('./node_modules/parcel-bundler/bin/cli.js', [
  command,
  'src/dashboard/*.html',
  '--out-dir',
  'dashboard',
  '--public-url',
  '.',
  isProduction ? '--no-minify':'',
]);
