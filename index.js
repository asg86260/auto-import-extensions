import fs from 'fs';
import path from 'path';
import config from './vite.config.js';
const { resolve } = config;

const projectDirectory = './src'; // Replace with your project's directory

// Function to recursively find JavaScript and Vue files
function findFiles(dir, filePattern) {
  let files = [];

  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      files = files.concat(findFiles(filePath, filePattern));
    } else if (filePattern.test(file)) {
      files.push(filePath);
    }
  });

  return files;
}

// Function to add file extension to module imports
function addFileExtensions(files) {
  files.forEach((file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file: ${file}`);
        console.error(err);
        return;
      }
      const updatedData = data.replaceAll(
        // eslint-disable-next-line no-useless-escape
        /(import\s+{?[^}]*?}?\s+from\s+['"])([^.'"]+)(['"]\s*;)|(import\s*\([\s\S]*?['"])([^'"]+[^/])(['"]\s*[\s\S]*?\)\s*)/g,
        (match, p1, p2, p3, p4, p5, p6) => {
          console.log({ p1, p2, p3, p4, p5, p6 });
          const g1 = p1 || p4;
          const g2 = p2 || p5;
          const g3 = p3 || p6;
          let filePath = path.join(path.dirname(file), g2);
          if (!g2.startsWith('.')) {
            filePath = resolveAlias(g2);
          }
          const jsFile = fs.existsSync(`${filePath}.js`);

          const vueFile = fs.existsSync(`${filePath}.vue`);

          const ifIndexExists = fs.existsSync(`${filePath}/index.js`);

          if (jsFile) {
            return `${g1}${g2}.js${g3}`;
          }

          if (vueFile) {
            return `${g1}${g2}.vue${g3}`;
          }

          if (ifIndexExists) {
            return `${g1}${g2}${g3}`;
          }
          return match;
        },
      );

      if (data !== updatedData) {
        fs.writeFile(file, updatedData, 'utf8', (writeErr) => {
          if (writeErr) {
            console.error(`Error writing file: ${file}`);
            console.error(writeErr);
          } else {
            console.log(`File updated: ${file}`);
          }
        });
      }
    });
  });
}

// Function to resolve aliases from vite.config.js
function resolveAlias(filePath) {
  const viteConfigPath = path.join('vite.config.js');
  if (fs.existsSync(viteConfigPath)) {
    if (resolve && resolve.alias) {
      for (const alias in resolve.alias) {
        if (filePath.startsWith(alias)) {
          const resolvedPath = filePath.replace(alias, resolve.alias[alias]);
          return resolvedPath;
        }
      }
    }
  }
  return filePath;
}

// Entry point
const filePattern = /\.(js|vue)$/i;
const files = findFiles(projectDirectory, filePattern);
addFileExtensions(files);
