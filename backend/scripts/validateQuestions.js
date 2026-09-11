const fs = require("fs");
const path = require("path");

const dataFolder = path.join(__dirname, "../data");

if (!fs.existsSync(dataFolder)) {
  console.log("❌ Data folder not found.");
  process.exit(1);
}

const files = fs.readdirSync(dataFolder).filter(file => file.endsWith(".json"));

console.log("\n==========================================");
console.log(" CBT JSON VALIDATOR");
console.log("==========================================\n");

let validFiles = 0;
let invalidFiles = 0;

for (const file of files) {
  const filePath = path.join(dataFolder, file);

  try {
    const content = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(content);

    if (!Array.isArray(data)) {
      console.log(`❌ ${file}`);
      console.log("   Root element must be an array.\n");
      invalidFiles++;
      continue;
    }

    let errors = 0;

    data.forEach((q, index) => {
      if (!q.subject) errors++;
      if (!q.question) errors++;
      if (!q.answer) errors++;

      if (!q.options) {
        errors++;
      } else if (Array.isArray(q.options)) {
        if (q.options.length !== 4) errors++;
      } else if (typeof q.options === "object") {
        const keys = Object.keys(q.options);
        if (
          keys.length !== 4 ||
          !keys.includes("A") ||
          !keys.includes("B") ||
          !keys.includes("C") ||
          !keys.includes("D")
        ) {
          errors++;
        }
      } else {
        errors++;
      }
    });

    if (errors === 0) {
      console.log(`✅ ${file} (${data.length} questions)`);
      validFiles++;
    } else {
      console.log(`⚠️ ${file}`);
      console.log(`   ${errors} validation issue(s)\n`);
      invalidFiles++;
    }

  } catch (err) {
    console.log(`❌ ${file}`);
    console.log(`   Invalid JSON`);
    console.log(`   ${err.message}\n`);
    invalidFiles++;
  }
}

console.log("\n==========================================");
console.log("SUMMARY");
console.log("==========================================");
console.log("Valid Files   :", validFiles);
console.log("Invalid Files :", invalidFiles);
console.log("==========================================");