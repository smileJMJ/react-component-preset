//@ts-nocheck

import { context, build } from "esbuild";
import { sassPlugin as sassPluginFunc } from "esbuild-sass-plugin";
import copy from "esbuild-plugin-copy";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const __filename = fileURLToPath(import.meta.url);

const deepMerge = (target, source) => {
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...new Set([...target, ...source])];
  } else if (
    typeof target === "object" &&
    target !== null &&
    typeof source === "object" &&
    source !== null
  ) {
    return Object.keys({ ...target, ...source }).reduce((acc, key) => {
      acc[key] =
        key === "entryPoints"
          ? Array.isArray(source[key]) && source[key]?.length > 0
            ? source[key]
            : target[key]
          : deepMerge(target[key], source[key]);
      return acc;
    }, {});
  } else {
    return source ?? target;
  }
};

const DEFAULT_LOADER = {
  ".jpg": "file",
  ".png": "file",
  ".webp": "file",
  ".svg": "file",
};

export const sassPlugin = sassPluginFunc;
const SASS_DEFAULT_PLUGIN = [
  // sass module - .scss보다 먼저 선언되어야 함
  sassPluginFunc({
    filter: /\.module\.scss$/,
    type: "local-css",
  }),

  // sass
  sassPluginFunc({
    filter: /\.scss$/,
    cssImports: true,
    type: "css",
    importMapper: (path) =>
      path
        .replace(/^@img\//, "./assets/img/")
        .replace(/^@svg\//, "./assets/svg/"),
  }),
];

const USE_DEFALT_PLUGINS = {
  sass: false,
};

export const isDevMode = () => {
  const args = process.argv;
  const modeValue = args?.filter((v) => v?.includes("mode="))[0];
  const mode = modeValue?.split("mode=")?.[1];

  return mode === "development";
};

const defaultConfig = {
  //entryPoints: ['./src/js/index.tsx'],
  entryPoints: [{ in: "./src/js/index.tsx", out: "./index" }],
  bundle: true,
  outdir: "./dist",
  outbase: "src", // src 폴더 내의 구조로 생성될 수 있도록 설정
  assetNames: "[dir]/[name]",
  jsx: "automatic", // import react 구문을 자동적으로 생성함
  loader: { ...DEFAULT_LOADER },
  plugins: [],
};

export const runDev = async (devOption = {}, customOption = {}) => {
  // devserver/index.html로 devserver 실행합니다.
  const { context: contextOption, serve: serveOption } = devOption; // sass plugin option
  const { useDefaultPlugins = USE_DEFALT_PLUGINS } = customOption; // custom option
  const DEV_OUTDIR =
    contextOption?.outdir ?? serveOption?.servedir ?? "devserver";
  const { watch, serve } = await context(
    deepMerge(
      deepMerge(
        { ...defaultConfig },
        {
          outdir: `${DEV_OUTDIR}/dist`,
          publicPath: "/dist", // devserver가 './'이며, resources들이 /dist 내부에 있어서 publicPath 지정해줘야 함
          sourcemap: true,
          plugins: [
            ...(useDefaultPlugins?.sass ? SASS_DEFAULT_PLUGIN : []),
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
        }
      ),
      devOption?.context ?? {}
    )
  );

  await serve(
    deepMerge(
      {
        servedir: DEV_OUTDIR,
        port: 2024,
        host: "localhost",
      },
      devOption?.serve ?? {}
    )
  );

  watch();
};

export const runDevOnlyBuild = async (devOption = {}) => {
  // 코드 변경에 따른 빌드만 진행합니다.
  const { context: contextOption } = devOption;
  const { watch } = await context(
    deepMerge({ ...defaultConfig, sourcemap: true }, devOption ?? {})
  );

  watch();
};

export const runBuild = async (buildOption = {}, customOption = {}) => {
  const { useDefaultPlugins = USE_DEFALT_PLUGINS } = customOption; // custom option
  await build(
    deepMerge(
      deepMerge(
        { ...defaultConfig },
        {
          minify: true,
          drop: ["console"],
          plugins: [...(useDefaultPlugins?.sass ? SASS_DEFAULT_PLUGIN : [])],
        }
      ),
      buildOption
    )
  );
};
