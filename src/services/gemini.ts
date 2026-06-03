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

export async function generateCustomQuiz(
  params: GenerationParams,
): Promise<SQLQuestion[]> {
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
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Defining the structural schema explicitly tells the Gemini engine
        // exactly what weights to assign ahead of time, speeding up the generation token rate.
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING }, // Works smoothly with your seed data IDs
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
            ],
          },
        },
      },
    });

    if (response.text) {
      const parsedData = JSON.parse(response.text);
      return Array.isArray(parsedData) ? parsedData : [parsedData];
    }
    return [];
  } catch (error) {
    console.error("Failed to generate custom quiz with Gemini:", error);
    return [];
  }
}
