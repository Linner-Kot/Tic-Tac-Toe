// eslint-disable-next-line unicorn/prefer-module, no-undef
module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:unicorn/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  // parser: '@babel/eslint-parser',
  // parserOptions: {
  //   requireConfigFile: false,
  //   babelOptions: {
  //     babelrc: false,
  //     configFile: false,
  //     // your babel options
  //     presets: ["@babel/preset-env"],
  //   },
  // },
  plugins: ['unicorn', '@typescript-eslint', 'prettier'],
  rules: {
    // 'indent': [ 'error', 2 ], // conflict with prettier
    // 'linebreak-style': [ 'error', 'unix' ], // conflict with prettier
    // 'quotes': [ 'error', 'single' ], // conflict with prettier
    // 'semi': [ 'error', 'always' ], // conflict with prettier
    'no-var': 'error',
    'no-use-before-define': 'error',
    // 'arrow-parens': [ 'error', 'as-needed' ], // conflict with prettier
    // 'object-curly-spacing': [ 'error', 'always' ], // conflict with prettier
    // 'array-bracket-spacing': [ 'error', 'always' ], // conflict with prettier
    // 'no-trailing-spaces': 'error', // conflict with prettier
    // 'no-tabs': 'error', // conflict with prettier
    eqeqeq: 'warn',
    camelcase: 'error',
    'prefer-const': 'error',
    'prettier/prettier': 'error', // need for eslint-plugin-prettier
    'arrow-body-style': 'off', // need for eslint-plugin-prettier
    'prefer-arrow-callback': 'off', // need for eslint-plugin-prettier
    'unicorn/no-null': 'off',
  },
};
// npx eslint-config-prettier ./src/*.js
