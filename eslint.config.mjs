import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),
  {
    ignores: ['node_modules', '.next', 'dist', 'out'],
  },
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'no-undef': 'error',

      // Show warning for unused variables
      'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
      'import/no-extraneous-dependencies': [
        'warn',
        {
          packageDir: './',
        },
      ],
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info'],
        },
      ],

      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            array: false,
            object: true,
          },
          AssignmentExpression: {
            array: false,
            object: false,
          },
        },
        {
          enforceForRenamedProperties: false,
        },
      ],

      'jsx-a11y/anchor-is-valid': [
        'warn',
        {
          components: ['Link'],
          specialLink: ['to'],
          aspects: ['noHref', 'invalidHref', 'preferButton'],
        },
      ],
      // manual off
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'react/no-multi-comp': 'off',
      'jsx-a11y/mouse-events-have-key-events': 'off',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/tabindex-no-positive': 'warn',
      // Allow .js files to use JSX syntax
      // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
      'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],

      // Functional and class components are equivalent from React’s point of view
      // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
      'react/prefer-stateless-function': 'off',
      //manaul off
      'react/no-array-index-key': 'off',
      'react/jsx-props-no-spreading': 'off',

      // ESLint plugin for prettier formatting
      // https://github.com/prettier/eslint-plugin-prettier
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      // need to check below settings
      'react/sort-comp': 'off',
      'no-underscore-dangle': 'off',
      'sx-a11y/label-has-for': 'off',
      'spaced-comment': 'off',
      'no-useless-escape': 'off',
      'no-unused-class': 'off',
      // 'css-modules/no-undef-class': 'error',
      // 'css-modules/no-unused-class': 'error',
      'prefer-rest-params': 'warn',
      'jsx-a11y/label-has-for': 'off',
      camelcase: 'warn',
      'react/no-did-mount-set-state': 'warn',
    },
  },
  prettier,
];

export default eslintConfig;
