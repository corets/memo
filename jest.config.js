module.exports = {
  roots: ["src"],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["./jest.react.js"],
  moduleNameMapper: { "^lodash-es$": "lodash" },
}
