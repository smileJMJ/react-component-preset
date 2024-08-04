/**
 * config-esbuild 등 esbuild 구성을 별도 패키지로 생성 시
 */
import { context, build } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import copy from "esbuild-plugin-copy";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const __filename = fileURLToPath(import.meta.url);

const isObject = (obj) => {
  return obj && typeof obj === "object" && !Array.isArray(obj);
};

const deepMerge = (target, ...sources) => {
  if (!sources.length) return target;

  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else if (Array.isArray(source[key])) {
        if (!target[key]) target[key] = [];
        target[key] = target[key].concat(source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
};

const loader = {
  ".jpg": "file",
  ".png": "file",
  ".webp": "file",
  ".svg": "file",
};

const plugins = [
  // sass module - .scss보다 먼저 선언되어야 함
  sassPlugin({
    filter: /\.module\.scss$/,
    type: "local-css",
  }),

  // sass
  sassPlugin({
    filter: /\.scss$/,
    cssImports: true,
    type: "css",
  }),
];

export const isDevMode = () => {
  const args = process.argv;
  const modeValue = args?.filter((v) => v?.includes("mode="))[0];
  const mode = modeValue?.split("mode=")?.[1];

  return mode === "development";
};

export const runDev = async (devOption = {}) => {
  // devserver/index.html로 devserver 실행합니다.
  const { context: contextOption, serve: serveOption } = devOption;
  const DEV_OUTDIR =
    contextOption?.outdir ?? serveOption?.servedir ?? "devserver";
  const entryPoints = contextOption?.entryPoints ?? ["./src/js/index.tsx"];

  const { watch, serve } = await context(
    deepMerge(
      {
        entryPoints,
        bundle: true,
        outdir: `${DEV_OUTDIR}/dist`,
        outbase: "./src",
        publicPath: "/dist", // devserver가 './'이며, resources들이 /dist 내부에 있어서 publicPath 지정해줘야 함
        assetNames: "[dir]/[name]",
        sourcemap: true,
        jsx: "automatic", // import react 구문을 자동적으로 생성함
        loader,
        plugins: [
          ...plugins,
          // 모노레포 구조에서 config-esbuild packages 생성 시, liveReload.js 코드를 사용처 devserver 폴더에 복붙하기 위한 코드
          copy({
            resolveFrom: "cwd",
            assets: {
              from: [
                `${path.resolve()}/node_modules/@rcp/config-esbuild/liveReload.js`,
              ],
              to: [`${path.resolve()}/${DEV_OUTDIR}`],
            },
          }),
        ],
      },
      devOption?.context ?? {}
    )
  );

  await serve(
    deepMerge(
      {
        servedir: DEV_OUTDIR,
        port: 2024,
      },
      devOption?.serve ?? {}
    )
  );

  watch();
};

export const runBuild = async (buildOption = {}) => {
  await build(
    deepMerge(
      {
        entryPoints: buildOption?.entryPoints ?? ["./src/js/index.tsx"],
        bundle: true,
        outdir: "./dist",
        outbase: "./src",
        assetNames: "[dir]/[name]",
        jsx: "automatic", // import react 구문을 자동적으로 생성함
        loader,
        plugins,
        minify: true,
      },
      buildOption
    )
  );
};
