module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 'off',
    'max-len': ['error', { code: 140 }],
    // eslint-disable-next-line quote-props
    'radix': 'off',
    'no-plusplus': 'off',
    'arrow-body-style': 'off',
    'prefer-const': 'off',
    'consistent-return': 'off',
    'import/extensions': 'off',
  },
};
