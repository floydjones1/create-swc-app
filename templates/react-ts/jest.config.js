module.exports = {
  preset: "ts-jest",
  verbose: true,
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  transform: { "^.+\\.(t|j)sx?$": "@swc/jest" },
  moduleNameMapper: {
    "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/identity-obj-proxy",
  },
};
