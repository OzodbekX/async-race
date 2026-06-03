import { globalIgnores } from 'eslint/config'
import { configs, plugins } from 'eslint-config-airbnb-extended'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'

// Airbnb's TypeScript rules use type-aware linting (projectService), so the
// whole config is scoped to application source. Build/config files live
// outside the app tsconfig and are ignored to keep the parser happy.
const SRC = ['src/**/*.{ts,tsx}']
const scope = (config) => ({ ...config, files: SRC })

export default [
  globalIgnores(['dist', 'vite.config.ts', 'eslint.config.js']),

  // Register the plugins Airbnb's rule sets reference.
  scope(plugins.stylistic),
  scope(plugins.importX),
  scope(plugins.react),
  scope(plugins.reactA11y),
  scope(plugins.reactHooks),
  scope(plugins.typescriptEslint),

  // Airbnb base + TypeScript + React rule sets.
  ...configs.base.recommended.map(scope),
  ...configs.base.typescript.map(scope),
  ...configs.react.recommended.map(scope),
  ...configs.react.typescript.map(scope),

  reactRefresh.configs.vite,

  {
    files: SRC,
    rules: {
      // Modern JSX transform — no React import needed.
      'react/react-in-jsx-scope': 'off',
      // Vite resolves extensions; don't require them in import paths.
      'import-x/extensions': 'off',
      // Named exports are intentional for hooks/components/slices.
      'import-x/prefer-default-export': 'off',
      // TypeScript optional props with default arguments cover this.
      'react/require-default-props': 'off',
      // Redux Toolkit uses Immer: mutating the `state` draft is the intended
      // pattern in reducers, so allow property writes on `state`.
      'no-param-reassign': [
        'error',
        { props: true, ignorePropertyModificationsFor: ['state'] },
      ],
    },
  },

  // Disable stylistic rules that conflict with Prettier (Prettier owns format).
  prettier,
]
