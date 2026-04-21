import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface TranslationResult {
  title: string;
  description: string;
  content: string;
}

export async function translateArticle(
  title: string, 
  description: string, 
  content: string, 
  targetLanguage: string
): Promise<TranslationResult> {
  const prompt = `Translate the following article to ${targetLanguage}. 
Maintain the HTML structure in the content precisely. 
Return the result in JSON format with keys: "title", "description", "content".

Title: ${title}
Description: ${description}
Content: ${content}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      title: result.title || title,
      description: result.description || description,
      content: result.content || content,
    };
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}

export async function translateArticleBulk(
  title: string,
  description: string,
  content: string,
  languages: { code: string; name: string }[]
): Promise<Record<string, TranslationResult>> {
  const langList = languages.map(l => l.name).join(', ');
  const prompt = `Translate the following article into these languages: ${langList}.
Maintain the HTML structure in the content exactly for each translation.
Return the result in JSON format where keys are language codes (${languages.map(l => l.code).join(', ')}) and values are objects with keys: "title", "description", "content".

Title: ${title}
Description: ${description}
Content: ${content}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Bulk translation error:", error);
    return {};
  }
}
