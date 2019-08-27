import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";

export default {
  input: "cohort_manager/js-src/main.tsx",
  output: {
    file: "cohort_manager/js-dist/bundle.js",
    format: "iife",
  },
  plugins: [
    replace({
      "process.env.NODE_ENV": '"production"',
    }),
    typescript(),
    resolve(),
    commonjs({
      namedExports: {
        react: ["createElement", "Component", "PureComponent"],
        "react-dom": ["render"],
      },
    }),
  ],
};
