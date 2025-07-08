import { Message, Source } from '../types';

export const sendMessageToGemini = async (
  message: string,
  history: Message[]
): Promise<{ text: string; sources: Source[]; followUpQuestions: string[] }> => {

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, history }),
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
            throw new Error(errorBody.error || `Request failed with status ${response.status}`);
        }

        const data = await response.json();

        return {
            text: data.text || '',
            sources: data.sources || [],
            followUpQuestions: data.followUpQuestions || [],
        };
    } catch (error) {
        console.error("Error calling backend service:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        throw new Error(`Could not connect to the Bennie service. Please check your connection and try again. (${errorMessage})`);
    }
};
