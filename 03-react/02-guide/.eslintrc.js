module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'max-classes-per-file': 'off',
    'react/no-array-index-key': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'class', next: 'class' },
      { blankLine: 'always', prev: 'class', next: 'function' },
      { blankLine: 'always', prev: 'function', next: 'class' },
      { blankLine: 'always', prev: 'function', next: 'function' },
    ],
  },
};
