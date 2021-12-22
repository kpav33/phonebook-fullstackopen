// Because I am using Prettier in my project I additionally configured ESLint to work with Prettier
// https://github.com/prettier/eslint-config-prettier
// https://dev.to/bigyank/a-quick-guide-to-setup-eslint-with-airbnb-and-prettier-3di2
// Keep in mind that projects created with Create React App already come with eslint config
// https://stackoverflow.com/questions/59633005/how-is-eslint-integrated-into-create-react-app

module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: [2, "always"],
    eqeqeq: "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": ["error", "always"],
    "arrow-spacing": ["error", { before: true, after: true }],
    "no-console": 0,
  },
};
