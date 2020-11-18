module.exports = {
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es6: true
  },
  extends: [
    "eslint:recommended",
    "prettier",
    "prettier/react",
    "plugin:react/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module" // es6 import/export
  },
  parser: "babel-eslint", // class properties
  plugins: ["prettier", "react"],
  rules: {
    "react/prop-types": [0],
    "prettier/prettier": [
      "warn",
      {
        semi: false,
        trailingComma: "none",
        printWidth: 90
      }
    ],
    "no-console": 0,
    "max-len": [2, { code: 90, ignoreComments: true }]
  }
}
