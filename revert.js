const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (/\.(tsx|ts|js|jsx|css|md|json|html)$/.test(file)) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const files = walkSync(__dirname);

let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Revert Wasfa -> Wasfa
  content = content.replace(/Wasfa/g, 'Wasfa');
  
  // Revert wasfa -> wasfa
  content = content.replace(/wasfa/g, 'wasfa');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Reverted ${file}`);
    changedFiles++;
  }
}

console.log(`Done! Reverted ${changedFiles} files.`);
