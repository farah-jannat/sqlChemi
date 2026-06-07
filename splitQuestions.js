// const fs = require('fs');
// const path = require('path');
// const allQuestions = require('./questions_master.json');

// const baseOutputDir = path.join(__dirname, 'public/datas/questions');
// const manifestPath = path.join(__dirname, 'public/datas/manifest.json');

// const manifest = allQuestions.map((q) => {
//   const folderPath = path.join(baseOutputDir, q.difficulty.toLowerCase());
//   if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

//   fs.writeFileSync(path.join(folderPath, `${q.id}.json`), JSON.stringify(q, null, 2));

//   return { id: q.id, difficulty: q.difficulty, tags: q.tags };
// });

// fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
// console.log(`Processed ${allQuestions.length} questions.`);

// --------------------------------

// const fs = require('fs');
// const path = require('path');
// const allQuestions = require('./questions_master.json'); // Your Source of Truth

// const baseOutputDir = path.join(__dirname, 'public/datas/questions');
// const manifestPath = path.join(__dirname, 'public/datas/manifest.json');

// // 1. DELETE EXISTING OUTPUT FOLDERS to ensure a clean state
// if (fs.existsSync(baseOutputDir)) {
//   fs.rmSync(baseOutputDir, { recursive: true, force: true });
// }
// fs.mkdirSync(baseOutputDir, { recursive: true });

// // 2. PROCESS QUESTIONS
// const manifest = allQuestions.map((q) => {
//   const folderPath = path.join(baseOutputDir, q.difficulty.toLowerCase());

//   if (!fs.existsSync(folderPath)) {
//     fs.mkdirSync(folderPath, { recursive: true });
//   }

//   // Write the individual file
//   fs.writeFileSync(path.join(folderPath, `${q.id}.json`), JSON.stringify(q, null, 2));

//   return { id: q.id, difficulty: q.difficulty, tags: q.tags };
// });

// // 3. WRITE THE NEW MANIFEST
// fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

// console.log(`✅ Sync complete. Processed ${allQuestions.length} questions.`);

// ------------------------------------
const fs = require("fs");
const path = require("path");

// 1. Safely load the file
let allQuestions = [];
const masterPath = path.join(__dirname, "questions_master.json");

try {
  const content = fs.readFileSync(masterPath, "utf8");
  allQuestions = JSON.parse(content || "[]"); // Handle empty file by defaulting to []
} catch (error) {
  console.error(
    "❌ Error reading questions_master.json. Ensure it is valid JSON.",
  );
  process.exit(1);
}

const baseOutputDir = path.join(__dirname, "public/datas/questions");
const manifestPath = path.join(__dirname, "public/datas/manifest.json");

// 2. Perform the full sync
if (fs.existsSync(baseOutputDir)) {
  fs.rmSync(baseOutputDir, { recursive: true, force: true });
}
fs.mkdirSync(baseOutputDir, { recursive: true });

const manifest = allQuestions.map((q) => {
  // Defensive coding to handle missing difficulty fields
  const diff = (q.difficulty || "easy").toLowerCase();
  const folderPath = path.join(baseOutputDir, diff);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  fs.writeFileSync(
    path.join(folderPath, `${q.id}.json`),
    JSON.stringify(q, null, 2),
  );
  return { id: q.id, difficulty: q.difficulty, tags: q.tags };
});

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`✅ Sync complete. Processed ${allQuestions.length} questions.`);
