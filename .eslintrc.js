module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
        jest: true,
    },
    extends: 'airbnb-base',
    overrides: [
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        eqeqeq: 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': [
            'error', 'always',
        ],
        'arrow-spacing': [
            'error', { before: true, after: true },
        ],
        'no-warning-comments': 0,
        'no-console': 0,
        indent: ['error', 4],
    },
};
