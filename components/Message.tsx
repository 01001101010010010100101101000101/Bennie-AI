import React from 'react';
import { Message as MessageType, Sender } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { FormattedMessage } from './FormattedMessage';

interface MessageProps {
    message: MessageType;
}

const IconWrapper: React.FC<{ children: React.ReactNode, sender: Sender }> = ({ children, sender }) => (
    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${sender === Sender.AI ? 'bg-indigo-600' : 'bg-gray-600'}`}>
        {children}
    </div>
);

export const Message: React.FC<MessageProps> = ({ message }) => {
    const isAI = message.sender === Sender.AI;

    return (
        <div className={`flex items-start gap-4 animate-fade-in ${isAI ? '' : 'flex-row-reverse'}`}>
            <IconWrapper sender={message.sender}>
                {isAI ? <BotIcon className="w-5 h-5 text-white" /> : <UserIcon className="w-5 h-5 text-white" />}
            </IconWrapper>
            <div className={`max-w-2xl px-4 py-3 rounded-xl shadow-md ${isAI ? 'bg-gray-700 rounded-tl-none' : 'bg-indigo-700 rounded-tr-none'}`}>
                {message.text && (
                    <div className="prose prose-invert prose-sm text-gray-200">
                        <FormattedMessage text={message.text} />
                    </div>
                )}
                {message.attachment && (
                    <div className="mt-2">
                        <a href={message.attachment.dataUrl} target="_blank" rel="noopener noreferrer" className="block border-2 border-gray-600 hover:border-indigo-500 rounded-lg overflow-hidden">
                            <img 
                                src={message.attachment.dataUrl} 
                                alt={message.attachment.name}
                                className="max-w-xs max-h-48 object-cover"
                            />
                        </a>
                        <p className="text-xs text-slate-400 mt-1 truncate">{message.attachment.name}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Add fade-in animation to tailwind.config.js if it existed, for now, we can use a style tag or just rely on react-transition-group if we could add it.
// For this project, a simple CSS class approach is sufficient. Let's just create a style in HTML or simply rely on the browser's default rendering. For better UX, a simple CSS animation is added directly.

const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
`;
document.head.appendChild(style);
