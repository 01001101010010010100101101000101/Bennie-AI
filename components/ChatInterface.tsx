
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Sender, Source } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { SendIcon, LinkIcon, SpinnerIcon } from './Icons';

// Helper to process inline markdown like **bold** and [links](url).
const processInlineFormatting = (text: string): React.ReactNode => {
    const regex = /(\*\*.*?\*\*)|(\[.*?\]\(https?:\/\/[^\s)]+\))/g;
    const parts = text.split(regex).filter(part => part);

    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
            return (
                <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-bennie-blue-light dark:text-bennie-blue-dark hover:underline font-medium">
                    {linkMatch[1]}
                </a>
            );
        }
        return part;
    });
};

// Component to render a full block of text, handling paragraphs, lists, and headings.
const RichTextRenderer: React.FC<{ text: string }> = ({ text }) => {
    // Split text into blocks based on one or more empty lines.
    const blocks = text.replace(/\r\n/g, '\n').split(/\n\s*\n/);

    return (
        <>
            {blocks.map((block, blockIndex) => {
                const trimmedBlock = block.trim();
                
                // Handle headings
                if (trimmedBlock.startsWith('### ')) {
                    return <h4 key={blockIndex} className="font-semibold mt-3 mb-1 text-base">{processInlineFormatting(trimmedBlock.substring(4))}</h4>;
                }
                if (trimmedBlock.startsWith('## ')) {
                    return <h3 key={blockIndex} className="font-bold mt-4 mb-2 text-lg">{processInlineFormatting(trimmedBlock.substring(3))}</h3>;
                }
                
                const lines = block.split('\n').filter(line => line.trim() !== '');
                if (lines.length === 0) return null;

                const isList = lines.every(line => line.trim().startsWith('* '));

                if (isList) {
                    return (
                        <ul key={blockIndex} className="list-disc space-y-1 pl-5 my-2">
                            {lines.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                    {processInlineFormatting(item.trim().substring(2))}
                                </li>
                            ))}
                        </ul>
                    );
                } else {
                    return (
                        <p key={blockIndex} className="my-2 whitespace-pre-wrap">
                            {processInlineFormatting(block)}
                        </p>
                    );
                }
            })}
        </>
    );
};


const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.sender === Sender.User;

    return (
        <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-navy dark:bg-bennie-blue-dark flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                    B
                </div>
            )}
            <div className={`max-w-xl p-3 md:p-4 rounded-2xl ${isUser ? 'bg-bennie-blue-light text-white rounded-br-lg' : 'bg-light-card dark:bg-dark-card rounded-bl-lg'}`}>
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-1">
                    <RichTextRenderer text={message.text} />
                </div>
                {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-light-text-secondary dark:text-dark-text-secondary">
                            <LinkIcon className="w-4 h-4" />
                            Sources
                        </h4>
                        <ul className="space-y-1">
                            {message.sources.map((source, index) => (
                                <li key={index} className="text-xs">
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-bennie-blue-light dark:text-bennie-blue-dark hover:underline truncate block">
                                        {source.title || source.uri}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};


export const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 'init', text: "Hi there! I'm Bennie. How can I help you? You can ask me about the VA Disability Compensation process, specific medical conditions, ratings, percentages, forms, appeals, just about anything!", sender: Sender.Bennie }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const executeSend = useCallback(async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), text: messageText, sender: Sender.User };
        
        // Optimistically update UI
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setSuggestedQuestions([]);
        setIsLoading(true);
        setError(null);

        try {
            const { text, sources, followUpQuestions } = await sendMessageToGemini(messageText, messages);
            
            const bennieMessage: Message = { id: (Date.now() + 1).toString(), text, sender: Sender.Bennie, sources };
            setMessages(prev => [...prev, bennieMessage]);
            setSuggestedQuestions(followUpQuestions);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(errorMessage);
            const bennieError: Message = { id: (Date.now() + 1).toString(), text: `I'm sorry, but I encountered an error: ${errorMessage}`, sender: Sender.Bennie };
            setMessages(prev => [...prev, bennieError]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, messages]);

    const handleSend = () => {
        executeSend(input);
    };

    const handleSuggestionClick = (question: string) => {
        executeSend(question);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-220px)] bg-light-bg dark:bg-dark-bg">
            <div className="flex-grow overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && (
                     <div className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full bg-navy dark:bg-bennie-blue-dark flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">B</div>
                        <div className="p-3 md:p-4 rounded-2xl rounded-bl-lg bg-light-card dark:bg-dark-card">
                           <div className="flex items-center space-x-3">
                                <SpinnerIcon className="w-5 h-5 text-bennie-blue-light dark:text-bennie-blue-dark" />
                                <span className="text-sm italic text-light-text-secondary dark:text-dark-text-secondary">I'm researching, just a moment please...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {suggestedQuestions.length > 0 && !isLoading && (
                <div className="px-4 pb-2">
                    <h4 className="text-sm font-semibold mb-2 text-light-text-secondary dark:text-dark-text-secondary">Suggested Questions:</h4>
                    <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => handleSuggestionClick(q)}
                                className="text-sm text-left bg-light-card dark:bg-dark-card border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
                <div className="flex items-center bg-light-card dark:bg-dark-card rounded-full p-2 shadow-sm">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask Bennie a question..."
                        className="w-full bg-transparent border-none focus:ring-0 px-4 text-light-text dark:text-dark-text"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="p-2 rounded-full bg-bennie-blue-light text-white hover:bg-navy disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors"
                        aria-label="Send message"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};