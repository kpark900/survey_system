// File: fixImportExtensions.js
// Version: 1.0.0
// AI Information: ChatGPT 4o
//
// Description:
// This script scans all JavaScript files in the specified directory and ensures that all local imports include their file extensions.
// It adds the appropriate extensions (.js, .jsx) to local imports if they are missing.
//
// Usage:
// 1. Place this script in the root of your project.
// 2. Run the script using `node fixImportExtensions.js`.
// 3. The script will modify all applicable files in the specified directory.

import fs from 'fs';
import path from 'path';

const targetDirectory = './src'; // Specify the directory to scan
const validExtensions = ['.js', '.jsx']; // Valid file extensions for imports

// Helper function to check if a file exists with valid extensions
const resolveFileExtension = (importPath, directory) => {
  for (const ext of validExtensions) {
    if (fs.existsSync(path.join(directory, `${importPath}${ext}`))) {
      return ext;
    }
  }
  return null;
};

// Function to process a single file
const processFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const updatedLines = lines.map((line) => {
    const importMatch = line.match(/import\s+(?:[^'";]+)\s+from\s+['"](\.\.?\/[^'";]+)['"];/);
    if (importMatch) {
      const importPath = importMatch[1];
      const directory = path.dirname(filePath);
      const ext = resolveFileExtension(importPath, directory);
      if (ext) {
        return line.replace(importPath, `${importPath}${ext}`);
      }
    }
    return line;
  });

  if (lines.join('\n') !== updatedLines.join('\n')) {
    fs.writeFileSync(filePath, updatedLines.join('\n'), 'utf-8');
    console.log(`Updated: ${filePath}`);
  }
};

// Recursively process all .js/.jsx files in a directory
const processDirectory = (directory) => {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      processFile(fullPath);
    }
  });
};

// Start processing the target directory
console.log(`Scanning directory: ${targetDirectory}`);
processDirectory(targetDirectory);
console.log('All imports have been updated with file extensions.');
