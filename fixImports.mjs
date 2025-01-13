// fixImports.mjs Version 0.03 by ChatGPT 4o

/**
 * This script scans your project directory for missing or incorrect file paths
 * in import statements. It resolves paths for local files and ensures external dependencies are installed.
 *
 * Usage:
 * Place this script in the project root directory.
 * Run it with Node.js using: node fixImports.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, 'src');
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// Helper to check if a file exists with any of the extensions
const resolveFilePath = (basePath, filePath) => {
  for (const ext of extensions) {
    const fullPath = path.join(basePath, `${filePath}${ext}`);
    if (fs.existsSync(fullPath)) {
      return `${filePath}${ext}`;
    }
  }
  console.warn(`Could not resolve path for: ${filePath} in ${basePath}`);
  return null;
};


// Check and install external dependencies
const ensureDependencyInstalled = (moduleName) => {
  const npmPackageMap = {
    'firebase/auth': 'firebase', // Map submodules to parent package
    'firebase/app': 'firebase',
    'firebase/firestore': 'firebase',
    'react-firebase-hooks/auth': 'react-firebase-hooks',
    'react-dom/client': 'react-dom', // Map submodule to parent package
  };

  const actualPackage = npmPackageMap[moduleName] || moduleName;

  try {
    require.resolve(moduleName);
  } catch (error) {
    console.log(`Dependency "${actualPackage}" is missing. Installing...`);
    try {
      execSync(`npm install ${actualPackage}`, { stdio: 'inherit' });
      console.log(`Dependency "${actualPackage}" installed.`);
    } catch (installError) {
      console.error(`Failed to install "${actualPackage}". Error:`, installError.message);
      throw installError;
    }
  }
};




// Read file content and update imports
const updateImports = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const updatedContent = content.replace(
    /import\s+(.*)\s+from\s+['"](.+)['"]/g,
    (match, imports, file) => {
      if (file.startsWith('.')) {
        const resolvedPath = resolveFilePath(path.dirname(filePath), file);
        if (resolvedPath) {
          return `import ${imports} from './${resolvedPath}'`;
        }
        console.warn(`Could not resolve path for: ${file}`);
        return match;
      } else {
        ensureDependencyInstalled(file);
        return match; // No changes for external modules
      }
    }
  );

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.log(`Updated imports in: ${filePath}`);
  }
};

// Recursively scan directory for JavaScript files
const scanDirectory = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      scanDirectory(fullPath);
    } else if (extensions.includes(path.extname(file))) {
      updateImports(fullPath);
    }
  });
};

// Start scanning from project root
scanDirectory(projectRoot);

console.log('Import paths and dependencies updated successfully.');
