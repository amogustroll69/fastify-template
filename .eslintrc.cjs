module.exports = {
  root: true,
  env: { es2022: true },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: ["build", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
};
