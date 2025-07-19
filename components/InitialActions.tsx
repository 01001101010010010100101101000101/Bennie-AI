

import React from 'react';

interface InitialActionsProps {
    onAction: (action: string) => void;
}

export const InitialActions: React.FC<InitialActionsProps> = ({ onAction }) => {
    const actions = [
        { label: 'How do I file a new claim?', prompt: "How do I file a new claim?" },
        { label: 'Estimate my potential payment', prompt: "How much would I get paid for my disability rating?" },
        { label: 'What is needed for a rating increase?', prompt: "What do I need to file for a rating increase?" },
        { label: 'What are my options to appeal?', prompt: "What are my options to appeal a decision?" },
        { label: 'Analyze and explain my letter', prompt: 'analyze' },
        { label: 'Can you explain TDIU?', prompt: "Can you explain what TDIU is and how to apply for it?" },
    ];

    return (
        <div className="max-w-4xl mx-auto mb-3 animate-fade-in">
            <div className="flex flex-wrap justify-center gap-2">
                {actions.map(({ label, prompt }) => (
                    <button
                        key={label}
                        onClick={() => onAction(prompt)}
                        className="px-4 py-2 bg-gray-700/80 border border-gray-600/90 text-sm text-gray-200 font-medium rounded-lg hover:bg-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};