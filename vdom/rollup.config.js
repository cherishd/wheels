import babel from 'rollup-plugin-babel'

export default {
  input: './index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    babel()
  ]
}
