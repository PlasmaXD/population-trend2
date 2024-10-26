// jest.setup.ts
import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// ResizeObserver のモックを追加
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;
