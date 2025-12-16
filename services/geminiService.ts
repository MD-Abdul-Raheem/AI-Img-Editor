
import { GoogleGenAI } from "@google/genai";

/**
 * Extracts the raw base64 string from a Data URI.
 * @param dataUri - The full Data URI (e.g., "data:image/png;base64,iVBOR...")
 * @returns The base64 string without the prefix.
 */
const extractBase64 = (dataUri: string): string => {
  return dataUri.split(',')[1];
};

/**
 * Edits an image using Gemini 2.5 Flash Image.
 * @param imageDataUri - The original image as a Data URI.
 * @param mimeType - The MIME type of the original image (supports image/* and application/pdf).
 * @param prompt - The text prompt for editing.
 * @returns A promise that resolves to the edited image Data URI.
 */
export const editImageWithGemini = async (
  imageDataUri: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const base64Data = extractBase64(imageDataUri);

    // Using Gemini 2.5 Flash Image for general editing tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `Act as a professional photo editor. 
            Instruction: ${prompt}
            
            Strictly output the edited image. Do not provide any conversational text, descriptions, or "Here is your image" messages. Just the image.`,
          },
        ],
      },
    });

    let resultImageUri = '';

    // Iterate through all parts to find the image part.
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const resultBase64 = part.inlineData.data;
          // The SDK might return mimeType, if not assume png for generated images
          const resultMime = part.inlineData.mimeType || 'image/png';
          resultImageUri = `data:${resultMime};base64,${resultBase64}`;
          break; 
        }
      }
    }

    if (!resultImageUri) {
        // Check for safety blocks or other finish reasons if no content
        if (response.candidates?.[0]?.finishReason && response.candidates[0].finishReason !== 'STOP') {
             throw new Error(`Generation stopped due to: ${response.candidates[0].finishReason}`);
        }

        // Fallback check if there's text explaining why it failed or if it was just chatty
        const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text)?.text;
        if (textPart) {
            // Clean up the text part for the error message
            const cleanedText = textPart.replace(/\n/g, ' ').trim();
            // If the model was chatty but didn't return an image, we treat it as an error
            throw new Error(`The model returned a message instead of an image: "${cleanedText.substring(0, 150)}${cleanedText.length > 150 ? '...' : ''}"`);
        }
        
        throw new Error("The model completed the request but returned no image data. Please try a different prompt or image.");
    }

    return resultImageUri;

  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    if (error instanceof Error) {
        throw error; // Re-throw with the descriptive message
    }
    throw new Error("An unexpected error occurred while editing the image.");
  }
};

/**
 * Generates context-aware prompt suggestions based on the image content.
 * @param imageDataUri - The image to analyze.
 * @param mimeType - The mime type of the image.
 * @returns A list of suggested prompts strings.
 */
export const generatePromptSuggestions = async (
  imageDataUri: string,
  mimeType: string
): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const base64Data = extractBase64(imageDataUri);
    
    // We use the lighter text model for analysis to get JSON output
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this image/document and generate 5 professional, high-quality image editing prompts relevant to this specific content. 
            
            Focus on practical tasks tailored to the image subject (e.g., product photography, portraits, landscapes, or documents).
            Examples of professional prompts:
            - "Isolate the product on a clean white studio background"
            - "Retouch skin texture for a professional portrait look"
            - "Remove people from the background"
            - "Color grade with a teal and orange cinematic aesthetic"
            - "Enhance clarity and remove noise from the text"

            Avoid whimsical or cartoonish suggestions unless the image style clearly warrants it.
            
            Return ONLY a JSON array of strings. Do not include markdown formatting like \`\`\`json.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5, // Lower temperature for more deterministic/professional results
      }
    });

    const text = response.text;
    if (!text) return [];
    
    // Parse JSON
    const suggestions = JSON.parse(text);
    if (Array.isArray(suggestions) && suggestions.every(s => typeof s === 'string')) {
      return suggestions.slice(0, 8); // Limit to 8
    }
    
    return [];
  } catch (error) {
    console.warn("Failed to generate suggestions:", error);
    return []; // Return empty to allow fallback to defaults
  }
};
