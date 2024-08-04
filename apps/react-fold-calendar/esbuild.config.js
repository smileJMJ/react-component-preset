import { isDevMode, runDev, runBuild } from "@rcp/config-esbuild";

try {
  if (isDevMode()) {
    // DEV
    runDev({
      context: {
        entryPoints: [{ in: "./src/ts/index.tsx", out: "./index" }],
      },
    });
  } else {
    // PROD
    runBuild({
      entryPoints: [{ in: "./src/ts/index.tsx", out: "./index" }],
    });
  }

  console.log("✨ Success");
} catch (error) {
  console.error(`🔥 error: ${error}`);
  process.exit(1);
}
