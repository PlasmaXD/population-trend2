// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
  
    // Babel を使用してトランスフォーム
    transform: {
      '^.+\\.(ts|tsx)$': 'babel-jest',
    },
  
    // テストファイルのパターンを指定
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  
    // モジュール解決の設定
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  
    // テスト実行前に実行するスクリプトを指定
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
    // canvas をモック
    setupFiles: ['jest-canvas-mock'],
  
    // テストカバレッジレポートの設定
    collectCoverage: true,
    collectCoverageFrom: [
      '**/*.{ts,tsx}',
      '!**/*.d.ts',
      '!**/node_modules/**',
      '!**/.next/**',
    ],
  };
  