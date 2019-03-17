module.exports = {
  "parser": "babel-eslint",
  "extends": ["plugin:prettier/recommended"],
  "rules": {
      "prettier/prettier": ["error", { 
          "singleQuote": true,
          "trailingComma": "none",
          "tabWidth": 2,
      }],
      "no-console": "error",
      "no-debugger": "error"
  }
};