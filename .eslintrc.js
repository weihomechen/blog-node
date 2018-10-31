module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  globals: {
    Babel: true,
    React: true
  },
  plugins: ['react'],
  rules: {
    'global-require': 'off',
    'class-methods-use-this': 'off',
    'react/jsx-no-bind': 'off',
    'no-param-reassign': 'off',
    'react/no-string-refs': 'off',
    'react/jsx-filename-extension': 'off',
    'import/no-extraneous-dependencies': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'import/extensions': 'off',
    'func-names': 'off',
    'space-before-blocks': 'off',
    'arrow-parens': 'off',
    'array-callback-return': 'off',
    'max-len': 'off',
    'no-console': 'off',
    'arrow-body-style': 'off',
    'react/sort-comp': 'off',
    'react/forbid-prop-types': 'off',
    camelcase: 'off',
    'object-curly-newline': 'off',
    'comma-dangle': 'off'
  }
};
