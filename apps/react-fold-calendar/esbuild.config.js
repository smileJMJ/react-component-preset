// eslint - process no-undef pass ↓↓
/* global process */

import { isDevMode, runDev, runBuild } from '@rcp/config-esbuild';
import pkg from './package.json' assert { type: 'json' }; // import(esm)에선 json 가져오려면 assertion 추가해야 함

const moduleBuildOption = {
  entryPoints: [{ in: './src/js/index.tsx', out: 'index' }],
  format: 'esm', // ESM 형식으로 내보내기 (esm으로 모듈 개발 시, 해당 옵션 꼭 필요. 없을 시 사용처에서 No matching export in "node_modules/react-fold-calendar/dist/index.js" for import "default" 에러 발생)
  external: ['*.css', 'react', 'react-dom'], // react와 react-dom은 외부 모듈로 처리 (peerDependencies로 react, react-dom 추가하면 굳이 함께 번들되지 않아도 될 것 같음. external로 react, react-dom 추가하면 import ~ from 'react' 구문 유지함)
  // supported: {
  //   'dynamic-import': true,
  // },
  banner: {
    js: `/* ${pkg.name}-${pkg.version}-${new Date().getTime()} */`,
  },
};

const browserBuildOption = {
  entryPoints: [{ in: './src/js/browser.tsx', out: 'browser' }],
  // supported: {
  //   'dynamic-import': true,
  // },
  external: ['*.css'],
  banner: {
    js: `/* ${pkg.name}-${pkg.version}-${new Date().getTime()} */`,
  },
};

const cssBuildOption = {
  entryPoints: [{ in: './src/css/calendar.css', out: 'calendar' }],
  loader: { '.svg': 'dataurl' },
  banner: {
    css: `/* ${pkg.name}-${pkg.version}-${new Date().getTime()} */`,
  },
};

try {
  if (isDevMode()) {
    // DEV - module
    runDev({
      context: {
        ...moduleBuildOption,
        entryPoints: [...moduleBuildOption.entryPoints, { in: './src/css/calendar.css', out: 'calendar' }],
        loader: { '.svg': 'dataurl' },
        external: ['*.css'], // devserver/module - index.html에서 script type="module" 로 module.js로 갖고 오면서, format: 'esm'으로 빌드한 index.js에서 react를 정상적으로 가져오지 못하여 빌드 시 react, react-dom 번들되도록 함
      },
      serve: {
        servedir: 'devserver/module',
        port: 7777,
      },
    });

    runDev({
      context: {
        ...browserBuildOption,
        entryPoints: [...browserBuildOption.entryPoints, { in: './src/css/calendar.css', out: 'calendar' }],
        loader: { '.svg': 'dataurl' },
        external: ['*.css'], // devserver/module - index.html에서 script type="module" 로 module.js로 갖고 오면서, format: 'esm'으로 빌드한 index.js에서 react를 정상적으로 가져오지 못하여 빌드 시 react, react-dom 번들되도록 함
      },
      serve: {
        servedir: 'devserver/browser',
        port: 7778,
      },
    });

    console.log('== localhost - module ==', 'http://localhost:7777');
    console.log('== localhost - browser ==', 'http://localhost:7778');
  } else {
    // PROD - index (module)
    runBuild(moduleBuildOption);

    // PROD - browser
    runBuild(browserBuildOption);

    // PROD - css
    runBuild(cssBuildOption);
  }

  console.log('✨ Success');
} catch (error) {
  console.error(`🔥 error: ${error}`);
  process.exit(1);
}
