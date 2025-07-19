
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { Footer } from './components/Footer';
import { PrivacyModal } from './components/PrivacyModal';
import { InitialActions } from './components/InitialActions';
import { FaqPolicy } from './components/FaqPolicy';
import { Message, Sender } from './types';
import { startChat } from './services/geminiService';

type ApiAttachment = {
    mimeType: string;
    data: string;
};

const fileToApiParts = (file: File): Promise<ApiAttachment & { dataUrl: string; name: string; }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target && typeof event.target.result === 'string') {
                const dataUrl = event.target.result;
                // Gemini API wants just the base64 string, without the data URL prefix
                const base64Data = dataUrl.split(',')[1];
                if (!base64Data) {
                    return reject(new Error("Could not extract base64 data from file."));
                }
                resolve({
                    dataUrl: dataUrl,
                    name: file.name,
                    mimeType: file.type,
                    data: base64Data,
                });
            } else {
                reject(new Error("Failed to read file."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showInitialActions, setShowInitialActions] = useState(false);
    const [view, setView] = useState<'chat' | 'faq'>('chat');
    const [chat, setChat] = useState<any>(null); // <-- ADD THIS LINE
    const fileInputRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
    // This function now initializes the entire chat session
    const initializeChat = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // 1. Start the chat session and save it in our new state variable
            const chatSession = await startChat();
            setChat(chatSession);

            // 2. Use the new session to send the very first message
            const result = await chatSession.sendMessage("Give me your initial greeting as Bennie.");
            const response = result.response;
            const text = response.text();
            
            // 3. Add the AI's greeting to the message list
            setMessages([{
                id: crypto.randomUUID(),
                sender: Sender.AI,
                text: text
            }]);
            setShowInitialActions(true);

        } catch (err) {
            console.error("Initialization Error:", err);
            const errorMessage = "I'm sorry, I'm having trouble connecting to my services right now. Please check your connection or try refreshing the page.";
            setError(errorMessage);
            setMessages([{
                id: crypto.randomUUID(),
                sender: Sender.AI,
                text: errorMessage
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    initializeChat();
}, []);

    const handleSendMessage = async (text: string, file?: File) => {
    // Check if loading or if the chat session isn't ready yet
    if (isLoading || !chat) return;
    if (text.trim() === '' && !file) return;

    setShowInitialActions(false);
    setIsLoading(true);
    setError(null);

    const userMessageText = text.trim() || "Please analyze the attached document.";

    // Add user message to the UI immediately
    setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        sender: Sender.User,
        text: userMessageText
    }]);

    try {
        let promptParts: (string | ApiAttachment)[] = [userMessageText];

        if (file) {
            const attachmentData = await fileToApiParts(file);
            // The Gemini API expects the attachment as part of the prompt array
            promptParts.push({ mimeType: attachmentData.mimeType, data: attachmentData.data });
        }

        // Use the chat session to send the message
        const result = await chat.sendMessage(promptParts);
        const response = result.response;
        const aiResponseText = response.text();

        const aiMessage: Message = {
            id: crypto.randomUUID(),
            sender: Sender.AI,
            text: aiResponseText,
        };
        setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
        console.error("Message Error:", err);
        const errorMessage = "There was an error getting a response. Please try again.";
        setError(errorMessage);
        const errorAiMessage: Message = {
            id: crypto.randomUUID(),
            sender: Sender.AI,
            text: errorMessage
        };
        setMessages(prev => [...prev, errorAiMessage]);
    } finally {
        setIsLoading(false);
    }
};
     const handleInitialAction = (action: string) => {
        setShowInitialActions(false);
        if (action === 'analyze') {
            setIsModalOpen(true);
        } else {
            handleSendMessage(action);
        }
    };

    const handleAgreeAndUpload = () => {
        setIsModalOpen(false);
        fileInputRef.current?.click();
    };

    return (
        <>
            <PrivacyModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAgree={handleAgreeAndUpload}
            />
            <div className="flex flex-col h-screen bg-transparent text-gray-200">
                <Header currentView={view} setView={setView} />
                <main className="flex-1 flex flex-col overflow-hidden">
                    {view === 'chat' ? (
                        <>
                            <ChatWindow messages={messages} isLoading={isLoading} />
                            <div className="px-4 pb-2">
                                {showInitialActions && <InitialActions onAction={handleInitialAction} />}
                                <ChatInput 
                                    onSend={handleSendMessage}
                                    disabled={isLoading}
                                    onUploadClick={() => setIsModalOpen(true)}
                                    ref={fileInputRef}
                                />
                                {error && <p className="text-center text-red-400 text-sm mt-2">{error}</p>}
                            </div>
                        </>
                    ) : (
                        <FaqPolicy />
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
};

export default App;
