/* eslint-disable */
export default {
  displayName: 'exporter',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  transformIgnorePatterns: [
    "node_modules/(?!(roughjs|points-on-curve|path-data-parser|points-on-path|konva)/)"
  ],
  resetMocks: false,
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/exporter',
};
