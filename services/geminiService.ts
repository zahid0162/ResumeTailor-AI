
import { GoogleGenAI, Type } from "@google/genai";
import { TailoredResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const tailorResume = async (
  originalResume: string,
  jobDescription: string
): Promise<TailoredResult> => {
  const model = "gemini-3-pro-preview";
  
  const prompt = `
    You are an expert Executive Career Coach and Resume Writer with 20+ years of experience in technical recruiting and HR.
    
    TASK:
    Rewrite the following resume to perfectly align with the provided job description.
    
    GOALS:
    1. Optimize for ATS (Applicant Tracking Systems) by naturally incorporating relevant keywords from the job description.
    2. Quantify achievements (e.g., "Increased revenue by 20%", "Reduced latency by 50ms").
    3. Ensure the summary and top-level skills section highlight exactly what the job description is looking for.
    4. Maintain the professional truth of the original resume—do not invent experiences, but rephrase existing ones to emphasize relevance.
    5. Return the result in a structured JSON format.

    ORIGINAL RESUME:
    ${originalResume}

    JOB DESCRIPTION:
    ${jobDescription}
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tailoredResume: {
            type: Type.STRING,
            description: "The complete rewritten resume in professional Markdown format.",
          },
          keyChanges: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of key strategic changes made to the resume.",
          },
          matchScore: {
            type: Type.NUMBER,
            description: "An estimated match score from 0 to 100 between the new resume and the job requirements.",
          },
        },
        required: ["tailoredResume", "keyChanges", "matchScore"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from AI service");
  }

  return JSON.parse(response.text.trim()) as TailoredResult;
};
