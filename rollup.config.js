import resolve from '@rollup/plugin-node-resolve';

export default [
  {
  input: './index.js',
  output: [
    {
      format: 'esm',
      file: './bundle.js'
    },
  ],
  plugins: [
    resolve(),
  ]
  },
  {
    input: './ifc/ifc.js',
    output: [
      {
        format: 'esm',
        file: './ifc/ifc-bundle.js'
      },
    ],
    plugins: [
      resolve(),
    ]
    }
];