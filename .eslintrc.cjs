module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react", "simple-import-sort"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // Add your custom rules here
    "react/react-in-jsx-scope": "off", // Needed for React 17+
    "react/prop-types": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
  overrides: [
    {
      files: ["**/*.test.{js,jsx}"],
      env: {
        vitest: true,
      },
    },
  ],
};
