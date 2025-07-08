import { Message, Source } from '../types';

export const sendMessageToGemini = async (
  message: string,
  history: Message[]
): Promise<{ text: string; sources: Source[]; followUpQuestions: string[] }> => {

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
    const errorMessage = errorBody.error || `Request failed with status ${response.status}`;
    throw new Error(`Failed to get response from Bennie. Please try again. (${errorMessage})`);
  }
  
  const data = await response.json();

  return {
    text: data.text || '',
    sources: data.sources || [],
    followUpQuestions: data.followUpQuestions || [],
  };
};