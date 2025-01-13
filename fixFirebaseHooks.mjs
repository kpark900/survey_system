// fixFirebaseHooks.mjs Version 0.01 by ChatGPT 4o

import fs from 'fs';
import path from 'path';

const appFilePath = path.join('src', 'App.js');
const webpackConfigPath = path.join('webpack.config.js');

// Fix import path in App.js
const fixAppJsImport = () => {
  if (fs.existsSync(appFilePath)) {
    let content = fs.readFileSync(appFilePath, 'utf-8');
    content = content.replace(
      /import\s+\{\s*useAuthState\s*\}\s+from\s+['"]react-firebase-hooks\/auth['"]/,
      "import { useAuthState } from 'react-firebase-hooks';"
    );
    fs.writeFileSync(appFilePath, content, 'utf-8');
    console.log(`Updated import path in: ${appFilePath}`);
  } else {
    console.error(`File not found: ${appFilePath}`);
  }
};

// Update Webpack configuration
const updateWebpackConfig = () => {
  if (fs.existsSync(webpackConfigPath)) {
    let content = fs.readFileSync(webpackConfigPath, 'utf-8');
    if (!content.includes('.esm.js')) {
      content = content.replace(
        /extensions:\s*\[([^\]]+)\]/,
        "extensions: [$1, '.esm.js']"
      );
      fs.writeFileSync(webpackConfigPath, content, 'utf-8');
      console.log(`Updated Webpack configuration: ${webpackConfigPath}`);
    } else {
      console.log(`Webpack configuration already supports '.esm.js'`);
    }
  } else {
    console.error(`File not found: ${webpackConfigPath}`);
  }
};

// Main function
const main = () => {
  console.log('Fixing issues...');
  fixAppJsImport();
  updateWebpackConfig();
  console.log('Fixes applied successfully.');
};

main();
