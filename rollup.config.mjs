import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'node_modules/mermaid/dist/mermaid.core.mjs',
  output: {
    dir: 'mermaid', // Change from output.file to output.dir
    format: 'cjs',
    chunkFileNames: '[name].cjs.js', // Add this line
  },
  plugins: [resolve(), commonjs()],
};
