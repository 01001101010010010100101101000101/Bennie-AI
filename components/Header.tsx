
import React from 'react';
import { BotIcon } from './icons/BotIcon';

interface HeaderProps {
    currentView: 'chat' | 'faq';
    setView: (view: 'chat' | 'faq') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
    
    const getButtonClass = (view: 'chat' | 'faq') => {
        const base = "px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200";
        if (currentView === view) {
            return `${base} bg-indigo-600 text-white`;
        }
        return `${base} text-gray-300 hover:bg-gray-700 hover:text-white`;
    };

    return (
        <header className="bg-gray-800/60 backdrop-blur-sm p-4 border-b border-gray-700 shadow-lg sticky top-0 z-10">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-indigo-600 p-2 rounded-full">
                        <BotIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Bennie</h1>
                        <p className="text-sm text-slate-400">Your guide to Veteran disability compensation.</p>
                    </div>
                </div>
                <nav className="flex items-center space-x-2">
                    <button onClick={() => setView('chat')} className={getButtonClass('chat')}>
                        Chat
                    </button>
                    <button onClick={() => setView('faq')} className={getButtonClass('faq')}>
                        FAQ & Policy
                    </button>
                </nav>
            </div>
        </header>
    );
};
