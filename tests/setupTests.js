import { jest } from '@jest/globals';
jest.unstable_mockModule('../src/line-types.js', () => ({
   default: [],
   lineTypes: [],
   lineTypesByName: {},
}));