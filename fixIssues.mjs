// fixIssues.mjs Version 0.01 by ChatGPT 4o

/**
 * This script fixes the following issues in your project:
 * - Ensures the `react-firebase-hooks` library is installed and properly imported.
 * - Updates `button.js` to use default export if needed.
 * - Adds missing file extensions to import paths.
 *
 * Usage:
 * Place this script in your project root.
 * Run it with Node.js: `node fixIssues.mjs`
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Ensure dependencies are installed
const ensureDependencies = () => {
  try {
    execSync('npm install react-firebase-hooks', { stdio: 'inherit' });
    console.log('Dependency `react-firebase-hooks` is installed.');
  } catch (error) {
    console.error('Failed to install `react-firebase-hooks`:', error.message);
  }
};

// Fix `button.js` export
const fixButtonExport = () => {
  const buttonPath = path.join('src', 'components', 'ui', 'button.js');
  if (fs.existsSync(buttonPath)) {
    let content = fs.readFileSync(buttonPath, 'utf-8');
    if (!content.includes('export default')) {
      content = `
        const Button = (props) => {
          return <button {...props}>{props.children}</button>;
        };
        export default Button;
      `;
      fs.writeFileSync(buttonPath, content, 'utf-8');
      console.log(`Updated default export in: ${buttonPath}`);
    } else {
      console.log(`Default export already exists in: ${buttonPath}`);
    }
  } else {
    console.error(`File not found: ${buttonPath}`);
  }
};

// Fix import extensions in `App.js`
const fixAppImports = () => {
  const appPath = path.join('src', 'App.js');
  if (fs.existsSync(appPath)) {
    let content = fs.readFileSync(appPath, 'utf-8');
    content = content.replace(
      /import\s+Button\s+from\s+['"](.+?)['"]/g,
      "import Button from './components/ui/button.js';"
    );
    content = content.replace(
      /import\s+StudentSurveyView\s+from\s+['"](.+?)['"]/g,
      "import StudentSurveyView from './views/StudentSurveyView.js';"
    );
    content = content.replace(
      /import\s+AdminTools\s+from\s+['"](.+?)['"]/g,
      "import AdminTools from './components/AdminTools.js';"
    );
    content = content.replace(
      /import\s+\{\s*initializeDatabase\s*\}\s+from\s+['"](.+?)['"]/g,
      "import { initializeDatabase } from './firebase/fire_initialize.js';"
    );
    fs.writeFileSync(appPath, content, 'utf-8');
    console.log(`Fixed import paths in: ${appPath}`);
  } else {
    console.error(`File not found: ${appPath}`);
  }
};

// Main function
const main = () => {
  console.log('Starting fixes...');
  ensureDependencies();
  fixButtonExport();
  fixAppImports();
  console.log('Fixes completed.');
};

main();

