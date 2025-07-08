import { GoogleGenAI } from "@google/genai";
import { Message, Source, Sender } from '../types';

// These types are for internal use in this file.
interface Part {
    text: string;
}
interface Content {
    role: 'user' | 'model';
    parts: Part[];
}

// System instruction for the AI model.
const systemInstruction = `You are "Bennie," a friendly, respectful, and helpful AI assistant for U.S. military veterans. Your primary purpose is to help veterans understand the VA disability compensation system.

Your answers MUST be based on a strict hierarchy of sources:
1.  Primary Source: Title 38 of the Code of Federal Regulations (38 CFR). Cite specific regulations when possible (e.g., 38 CFR § 4.71a).
2.  Secondary Source: Official U.S. government websites, especially va.gov.
3.  Tertiary Source: Other public, authoritative websites (e.g., reputable veterans' organizations, well-established legal resources on veterans' law).

Key instructions:
- Provide direct, factual answers. Get straight to the point and avoid conversational filler or introductory phrases like "Of course," "Certainly," or "That's a great question."
- Explain complex topics clearly and simply.
- When relevant, elaborate on "nexus letters," explaining they are reports from a medical professional that connect a veteran's condition to their military service.
- When you mention a specific VA form (e.g., VA Form 21-526EZ) or a specific page on a government website, you MUST provide an inline hyperlink to its webpage using markdown format, like [VA Form 21-526EZ](URL_TO_FORM_PAGE). Use Google Search to find the most accurate, current URLs.
- Never provide medical or legal advice. Always include a disclaimer to consult with a VA-accredited representative or medical professional.
- Use Google Search grounding for all responses.
- AFTER providing your complete answer, you MUST add a separator line containing ONLY '|||SUGGESTIONS|||'.
- AFTER the separator, you MUST provide exactly 5 distinct, relevant follow-up questions, each on a new line.`;

// Initialize the Google AI SDK. The API key is provided by the AI Studio environment.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const formatChatHistory = (messages: Message[]): Content[] => {
    // We don't include the initial "Hi I'm Bennie" message in the history sent to the model.
    return messages.filter(msg => msg.id !== 'init').map(msg => ({
        role: msg.sender === Sender.User ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
};

export const sendMessageToGemini = async (
  message: string,
  history: Message[]
): Promise<{ text: string; sources: Source[]; followUpQuestions: string[] }> => {
    
    try {
        const chatHistory = formatChatHistory(history || []);
        const contents = [...chatHistory, { role: 'user' as const, parts: [{ text: message }] }];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
                systemInstruction: {
                    parts: [{ text: systemInstruction }]
                },
                tools: [{ googleSearch: {} }]
            }
        });

        if (!response.candidates || response.candidates.length === 0) {
            throw new Error("Invalid response from AI service: No candidates found.");
        }
        
        const responseText = response.text;
        const separator = '|||SUGGESTIONS|||';
        const parts = responseText.split(separator);
        
        const answer = parts[0]?.trim() || '';
        let followUpQuestions: string[] = [];
        
        if (parts.length > 1 && parts[1]) {
            followUpQuestions = parts[1].trim().split('\n').filter(q => q.trim() !== '');
        }

        let sources: Source[] = [];
        const groundingChunks = response.candidates[0]?.groundingMetadata?.groundingChunks;
        
        if (groundingChunks) {
            sources = groundingChunks
                .map(chunk => chunk.web)
                .filter((web): web is { uri: string; title: string } => !!web?.uri)
                .reduce((acc, current) => {
                    if (!acc.some(item => item.uri === current.uri)) {
                        acc.push({ uri: current.uri, title: current.title || current.uri });
                    }
                    return acc;
                }, [] as Source[]);
        }
        
        return {
            text: answer,
            sources,
            followUpQuestions,
        };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        throw new Error(`Failed to get a response from the AI service. Please try again. (${errorMessage})`);
    }
};