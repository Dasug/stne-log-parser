import { jest } from '@jest/globals';
jest.unstable_mockModule('../src/line-type.index.js', () => ({
   default: [],
   lineTypes: [],
   lineTypesByName: {},
}));