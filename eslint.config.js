import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import security from 'eslint-plugin-security'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  security.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'security/detect-object-injection': 'off',
      ...reactHooks.configs.recommended.rules,
    },
  },
  // Node.js scripts — allow Node + browser globals (fetch, setTimeout)
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.builtin,
        fetch: 'readonly',
        setTimeout: 'readonly',
      },
    },
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
    },
  },
)
