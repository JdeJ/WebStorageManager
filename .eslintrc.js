module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        '@typescript-eslint/ban-ts-ignore': 0,
        '@typescript-eslint/consistent-type-assertions': 0,
        '@typescript-eslint/camelcase': 0,
        '@typescript-eslint/no-unused-vars': 0,
        'no-script-url': 2,
        'no-self-compare': 2,
        'no-tabs': 2,
    },
};
