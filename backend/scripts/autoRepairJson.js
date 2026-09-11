const fs = require("fs");
const path = require("path");

const dataFolder = path.join(__dirname, "../data");

const files = fs.readdirSync(dataFolder);

let repaired = 0;
let skipped = 0;
let failed = 0;

console.log("======================================");
console.log(" CBT JSON AUTO REPAIR");
console.log("======================================");

for (const file of files) {

    if (!file.toLowerCase().endsWith(".json"))
        continue;

    const filePath = path.join(dataFolder, file);

    let text = fs.readFileSync(filePath, "utf8");

    const original = text;

    // Remove UTF-8 BOM
    text = text.replace(/^\uFEFF/, "");

    // Fix accidental ][ between arrays
    text = text.replace(/\]\s*\[/g, ",");

    // Remove trailing commas
    text = text.replace(/,\s*]/g, "]");
    text = text.replace(/,\s*}/g, "}");

    // Remove garbage after last ]
    const lastBracket = text.lastIndexOf("]");

    if (lastBracket !== -1) {
        text = text.substring(0, lastBracket + 1);
    }

    // Fix file name typo
    if (file === "Chemistry_Part4,json.json") {
        const newName = "Chemistry_Part4.json";

        fs.renameSync(
            filePath,
            path.join(dataFolder, newName)
        );

        console.log(`RENAMED: ${file} -> ${newName}`);
    }

    try {

        JSON.parse(text);

        if (text !== original) {
            fs.writeFileSync(filePath, text, "utf8");
            repaired++;
            console.log(`✔ Repaired ${file}`);
        } else {
            skipped++;
        }

    } catch (err) {

        failed++;

        console.log(`✖ Could not repair ${file}`);
        console.log(`   ${err.message}`);

    }

}

console.log();
console.log("======================================");
console.log("Repair Summary");
console.log("======================================");
console.log("Repaired :", repaired);
console.log("Skipped  :", skipped);
console.log("Failed   :", failed);
console.log("======================================");