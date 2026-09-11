const fs = require("fs");
const path = require("path");

const dataFolder = path.join(__dirname, "../data");

const files = fs.readdirSync(dataFolder);

let renamed = 0;

console.log("======================================");
console.log(" CBT DATA FILE RENAMER");
console.log("======================================");

files.forEach((file) => {
  const oldPath = path.join(dataFolder, file);

  if (!fs.statSync(oldPath).isFile()) return;

  // Skip files that already have .json
  if (path.extname(file).toLowerCase() === ".json") return;

  const newName = file + ".json";
  const newPath = path.join(dataFolder, newName);

  if (fs.existsSync(newPath)) {
    console.log(`SKIPPED (already exists): ${newName}`);
    return;
  }

  fs.renameSync(oldPath, newPath);
  renamed++;

  console.log(`RENAMED: ${file}  --->  ${newName}`);
});

console.log("======================================");
console.log(`Total files renamed: ${renamed}`);
console.log("======================================");