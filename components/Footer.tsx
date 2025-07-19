import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full px-4 py-3">
            <div className="max-w-4xl mx-auto">
                <p className="text-center text-xs text-slate-500 italic">
                    Disclaimer: Bennie is an informational tool and does not provide medical or legal advice. This AI can make mistakes. All information, especially regarding regulations, timelines, and forms, should be independently verified through official sources like Veteran.gov. Always consult with a qualified professional or an accredited VSO for personal advice.
                </p>
            </div>
        </footer>
    );
};