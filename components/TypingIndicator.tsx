import React from 'react';
import { BotIcon } from './icons/BotIcon';

export const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-start gap-4 animate-fade-in">
             <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-indigo-600">
                <BotIcon className="w-5 h-5 text-white" />
            </div>
            <div className="max-w-2xl px-4 py-3 rounded-xl shadow-md bg-gray-700 rounded-tl-none flex items-center space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            </div>
        </div>
    );
};