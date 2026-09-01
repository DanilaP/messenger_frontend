import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import react from 'eslint-plugin-react'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      react.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // --- стилистические правила (автофикс) ---
      'semi': ['error', 'always'],
      'quotes': ['error', 'double', { avoidEscape: true, allowTemplateLiterals: true }],
      'indent': ['error', 'tab'],
      'react/jsx-curly-spacing': ['error', { when: 'always', children: true }],
      'object-curly-spacing': ['error', 'always'],

      // --- отключаем правила, которые мешают (или меняем на warn) ---
      'react/react-in-jsx-scope': 'off',        // если используете react-jsx в tsconfig
      'react/display-name': 'off',              // не требует displayName
      '@typescript-eslint/no-explicit-any': 'warn',  // any как предупреждение
      'react-hooks/exhaustive-deps': 'warn',    // уже warning, можно оставить
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
])