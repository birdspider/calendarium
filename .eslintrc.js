module.exports = {
  root: true,
  env: {
    browser: true
  },
  parser: 'babel-eslint',
  extends: ['standard'],
  rules: {
    'space-before-function-paren': ['error', 'always'],
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false,
    codeFrame: true
  },
  globals: {
    LOG: 'readonly',
    PRODUCTION: 'readonly',
    $: 'readonly',
    jQuery: 'readonly'
  }
}
