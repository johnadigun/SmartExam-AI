const fs = require("fs");
const path = require("path");

const dataFolder = path.join(__dirname, "../data");

const files = fs
  .readdirSync(dataFolder)
  .filter(file => file.endsWith(".json"));

console.log("======================================");
console.log(" CBT QUESTION FORMAT CONVERTER");
console.log("======================================");

let convertedFiles = 0;
let convertedQuestions = 0;

for (const file of files) {

  const filePath = path.join(dataFolder, file);

  try {

    const questions = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    let changed = false;

    const updated = questions.map(q => {

      if (
        q.options &&
        !Array.isArray(q.options) &&
        typeof q.options === "object"
      ) {

        const optionArray = [
          q.options.A,
          q.options.B,
          q.options.C,
          q.options.D,
        ];

        let answer = q.answer;

        if (["A","B","C","D"].includes(answer)) {
          answer = q.options[answer];
        }

        changed = true;
        convertedQuestions++;

        return {
          ...q,
          difficulty: (q.difficulty || "medium").toLowerCase(),
          options: optionArray,
          answer
        };
      }

      return {
        ...q,
        difficulty: (q.difficulty || "medium").toLowerCase()
      };

    });

    if (changed) {

      fs.writeFileSync(
        filePath,
        JSON.stringify(updated, null, 2),
        "utf8"
      );

      convertedFiles++;

      console.log(`✔ Converted ${file}`);

    }

  } catch (err) {

    console.log(`✖ Failed ${file}`);
    console.log(err.message);

  }

}

console.log("\n======================================");
console.log("Conversion Complete");
console.log("======================================");
console.log("Files Converted :", convertedFiles);
console.log("Questions Fixed :", convertedQuestions);
console.log("======================================");