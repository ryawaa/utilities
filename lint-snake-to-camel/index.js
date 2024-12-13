const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function camelCase(str) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

function fixCamelCaseInFile(filePath, identifiers) {
  console.log(`Attempting to fix file: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  identifiers.forEach(identifier => {
    const camelCased = camelCase(identifier);
    const regex = new RegExp(`\\b${identifier}\\b`, 'g');
    const matches = content.match(regex);
    if (matches) {
      console.log(`  Found ${matches.length} occurrences of '${identifier}' in ${filePath}`);
      content = content.replace(regex, camelCased);
      modified = true;
      console.log(`  Replaced '${identifier}' with '${camelCased}'`);
    } else {
      console.log(`  No occurrences of '${identifier}' found in ${filePath}`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed camelcase issues in ${filePath}`);
  } else {
    console.log(`No changes made to ${filePath}`);
  }
}

try {
  console.log('Running lint command...');
  const lintOutput = execSync('npm run lint', { encoding: 'utf8' });
  console.log('Lint command completed. Parsing output...');
  const lines = lintOutput.split('\n');

  const fileIssues = {};

  let currentFile = null;

  lines.forEach((line, index) => {
    console.log(`Processing line ${index + 1}: ${line}`);
    
    const fileMatch = line.match(/^\.\/(.+)$/);
    if (fileMatch) {
      currentFile = fileMatch[1];
      console.log(`Found file: ${currentFile}`);
    } else if (currentFile) {
      const issueMatch = line.match(/\d+:\d+\s+Warning:\s+Identifier '(.+)' is not in camel case/);
      if (issueMatch) {
        const [, identifier] = issueMatch;
        console.log(`Found issue in ${currentFile}: Identifier: ${identifier}`);
        if (!fileIssues[currentFile]) {
          fileIssues[currentFile] = new Set();
        }
        fileIssues[currentFile].add(identifier);
      }
    }
  });

  console.log('Files with camelcase issues:');
  console.log(JSON.stringify(fileIssues, null, 2));

  Object.entries(fileIssues).forEach(([filePath, identifiers]) => {
    fixCamelCaseInFile(filePath, Array.from(identifiers));
  });

  console.log('Finished fixing camelcase issues.');
} catch (error) {
  console.error('Error running lint command:', error.message);
  if (error.stdout) console.error('Lint command stdout:', error.stdout);
  if (error.stderr) console.error('Lint command stderr:', error.stderr);
}
