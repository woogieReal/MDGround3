/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "@/components/(.*)": "<rootDir>/components/$1",
    "@/pages/(.*)": "<rootDir>/pages/$1",
    "@/public/(.*)": "<rootDir>/public/$1",
    "@/src/(.*)": "<rootDir>/src/$1",
    "@/styles/(.*)": "<rootDir>/styles/$1",
    "@/tests/(.*)": "<rootDir>/tests/$1",
    "@/logs/(.*)": "<rootDir>/logs/$1",
  }
}