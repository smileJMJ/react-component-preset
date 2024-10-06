import { isDevMode, runDevOnlyBuild, runBuild } from "@rcp/config-esbuild";

try {
  if (isDevMode()) {
    // PROD - esm
    runDevOnlyBuild({
      entryPoints: ["./src/**/"],
      format: "esm",
      outbase: "src/js",
      external: ["react", "react-dom"],
      sourcemap: "inline",
    });
  } else {
    // PROD - esm
    runBuild({
      entryPoints: ["./src/**/"],
      format: "esm",
      outbase: "src/js",
      external: ["react", "react-dom"],
    });

    // PROD - cjs
    runBuild({
      entryPoints: ["./src/**/*.ts", "./src/**/*.tsx"],
      format: "cjs",
      outbase: "src/js",
      outExtension: { ".js": ".cjs" },
      external: ["react", "react-dom"],
    });
  }

  console.log("✨ Success");
} catch (error) {
  console.error(`🔥 error: ${error}`);
  process.exit(1);
}
