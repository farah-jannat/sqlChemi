import { GoogleGenAI, Type } from "@google/genai";
import { SQLQuestion } from "@/types/quiz";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

interface GenerationParams {
  company?: string;
  theme: string;
  difficulty: "Easy" | "Medium" | "Hard";
  count: number;
}

// // Add this to gemini.ts
// export async function evaluateSQL(
//   userQuery: string,
//   correctQuery: string
// ): Promise<{ isCorrect: boolean; explanation: string }> {

//   // 1. FAST PATH: Basic cleaning and comparison (Free & Instant)
//   const clean = (q: string) => q.replace(/\s+/g, ' ').trim().toLowerCase();
//   if (clean(userQuery) === clean(correctQuery)) {
//     return { isCorrect: true, explanation: "Perfect match!" };
//   }

//   // 2. AI PATH: Logic verification (Only if fast path fails)
//   const prompt = `
//     You are an expert SQL evaluator.
//     Compare the following two SQL queries and determine if they are logically equivalent in result.

//     Expected Query: ${correctQuery}
//     User Query: ${userQuery}

//     Return ONLY a JSON object: {"isCorrect": boolean, "explanation": string}
//   `;

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.0-flash", // Use a fast, efficient model
//       contents: prompt,
//       config: { responseMimeType: "application/json" }
//     });

//     return JSON.parse(response.text || '{"isCorrect": false, "explanation": "Evaluation failed"}');
//   } catch (e) {
//     return { isCorrect: false, explanation: "Could not verify logic, please check syntax." };
//   }
// }

// export async function generateCustomQuiz(
//   params: GenerationParams,
// ): Promise<SQLQuestion[]> {
//   if (!apiKey) {
//     console.error("Gemini API key is missing.");
//     return [];
//   }

//   const prompt = `
//     You are an expert Data Analytics Interviewer. Generate an array of exactly ${params.count} unique SQL technical interview questions.

//     Follow these strict business customizations:
//     - Target Company Style: ${params.company || "A modern tech company"}
//     - Theme/Industry Focus: ${params.theme || "General E-commerce and Business Operations"}
//     - Technical Difficulty Level: ${params.difficulty}

//     Make sure the scenarios, table schemas, and queries realistically fit the company and theme provided.
//   `;

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//       config: {
//         responseMimeType: "application/json",
//         // Defining the structural schema explicitly tells the Gemini engine
//         // exactly what weights to assign ahead of time, speeding up the generation token rate.
//         responseSchema: {
//           type: Type.ARRAY,
//           items: {
//             type: Type.OBJECT,
//             properties: {
//               id: { type: Type.STRING }, // Works smoothly with your seed data IDs
//               title: { type: Type.STRING },
//               difficulty: {
//                 type: Type.STRING,
//                 enum: ["Easy", "Medium", "Hard"],
//               },
//               scenario: { type: Type.STRING },
//               tableSchema: { type: Type.STRING },
//               expectedOutput: { type: Type.STRING },
//               hint: { type: Type.STRING },
//               correctQuery: { type: Type.STRING },
//             },
//             required: [
//               "id",
//               "title",
//               "difficulty",
//               "scenario",
//               "tableSchema",
//               "expectedOutput",
//               "hint",
//               "correctQuery",
//             ],
//           },
//         },
//       },
//     });

//     if (response.text) {
//       const parsedData = JSON.parse(response.text);
//       return Array.isArray(parsedData) ? parsedData : [parsedData];
//     }
//     return [];
//   } catch (error) {
//     console.error("Failed to generate custom quiz with Gemini:", error);
//     return [];
//   }
// }

// Add this utility to your gemini.ts
async function fetchWithRetry(
  apiCall: () => Promise<any>,
  retries = 3,
  delay = 2000,
): Promise<any> {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error.status === 429 && retries > 0) {
      console.warn(`Rate limited. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(apiCall, retries - 1, delay * 2); // Double the delay each time
    }
    throw error;
  }
}
export async function generateCustomQuiz(
  params: GenerationParams,
): Promise<SQLQuestion[] | null> {
  if (!apiKey) {
    console.error("Gemini API key is missing.");
    return [];
  }

  const prompt = `
    You are an expert Data Analytics Interviewer. Generate an array of exactly ${params.count} unique SQL technical interview questions.

    Follow these strict business customizations:
    - Target Company Style: ${params.company || "A modern tech company"}
    - Theme/Industry Focus: ${params.theme || "General E-commerce and Business Operations"}
    - Technical Difficulty Level: ${params.difficulty}

    Make sure the scenarios, table schemas, and queries realistically fit the company and theme provided.
    
    CRITICAL: For every question, you MUST provide:
    1. 'setupSQL': A block of SQL DDL (CREATE TABLE) and DML (INSERT) statements to prepare the database for this specific problem.
    2. 'correctQuery': The standard SQL solution.
    3. 'enforceOrder': A boolean. Set to true if the final output order is strictly required, false if row order doesn't matter.
  `;

  try {
    const response = await fetchWithRetry(() =>
      ai.models.generateContent({
        model: "gemini-2.0-flash", // NOTE: Use 1.5-Flash instead of 2.0-Flash if you hit limits
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                difficulty: {
                  type: Type.STRING,
                  enum: ["Easy", "Medium", "Hard"],
                },
                scenario: { type: Type.STRING },
                tableSchema: { type: Type.STRING },
                expectedOutput: { type: Type.STRING },
                hint: { type: Type.STRING },
                correctQuery: { type: Type.STRING },
                setupSQL: { type: Type.STRING }, // NEW
                enforceOrder: { type: Type.BOOLEAN }, // NEW
              },
              required: [
                "id",
                "title",
                "difficulty",
                "scenario",
                "tableSchema",
                "expectedOutput",
                "hint",
                "correctQuery",
                "setupSQL", // NEW
                "enforceOrder", // NEW
              ],
            },
          },
        },
      }),
    );

    if (response.text) {
      const parsedData = JSON.parse(response.text);
      return Array.isArray(parsedData) ? parsedData : [parsedData];
    }
    return [];
  } catch (error: unknown) {
    // Use a type guard to safely check the error
    if (typeof error === "object" && error !== null && "status" in error) {
      const err = error as { status: number }; // Now TS knows it has a status
      if (err.status === 429) {
        console.warn("Quota exceeded.");
        return null;
      }
    }
    console.error("Failed to generate custom quiz with Gemini:", error);
    return [];
  }
}
