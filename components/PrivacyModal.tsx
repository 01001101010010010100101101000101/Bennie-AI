
import React from 'react';

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAgree: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, onAgree }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md border border-gray-700 animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-white mb-4">Privacy & Data Use</h2>
                <div className="text-slate-300 space-y-4 text-sm">
                    <p>Before you upload, here’s our promise about how your data is handled:</p>
                    
                    <div>
                        <h3 className="font-bold text-yellow-400 mb-2">Data Retention Policy: Simple & Clear</h3>
                        <ul className="list-disc list-inside space-y-2 pl-2">
                            <li><span className="font-semibold">Your File Stays Private:</span> The document you select is processed directly in your browser. It is <strong className="text-yellow-400">never uploaded to or stored on a server.</strong></li>
                            <li><span className="font-semibold">One-Time Analysis:</span> The contents are sent for a single, secure analysis and are <strong className="text-yellow-400">immediately discarded</strong> after Bennie responds. Nothing is logged or saved.</li>
                            <li><span className="font-semibold">Ephemeral Chat:</span> Your entire conversation is temporary and is <strong className="text-yellow-400">deleted when you close this browser tab.</strong></li>
                        </ul>
                    </div>
                    
                    <p>
                        This analysis is for informational purposes only. Please do not upload documents with sensitive information you are not comfortable sharing for this temporary analysis.
                    </p>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onAgree}
                        className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                    >
                        Agree & Upload
                    </button>
                </div>
            </div>
        </div>
    );
};
