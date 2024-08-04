# config-esbuild

- This is esbuild's config package.

## usage

```
import { isDevMode, runDev, runBuild } from "@rcp/config-esbuild";

try {
  if (isDevMode()) {
    // DEV
    runDev();
  } else {
    // PROD
    runBuild();
  }

  console.log("✨ Success");
} catch (error) {
  console.error(`🔥 error: ${error}`);
  process.exit(1);
}
```
