
import React, { useState, forwardRef } from 'react';
import { SendIcon } from './icons/SendIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { CloseIcon } from './icons/CloseIcon';

interface ChatInputProps {
    onSend: (text: string, file?: File) => void;
    disabled: boolean;
    onUploadClick: () => void;
}

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(({ onSend, disabled, onUploadClick }, ref) => {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (ref && 'current' in ref && ref.current) {
            ref.current.value = ''; // Clear the file input
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if ((text.trim() || file) && !disabled) {
            onSend(text, file ?? undefined);
            setText('');
            handleRemoveFile();
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 space-y-2">
                 {file && (
                    <div className="flex items-center justify-between bg-gray-700/50 text-sm p-2 rounded-md">
                        <span className="text-gray-300 truncate font-mono text-xs">{file.name}</span>
                        <button onClick={handleRemoveFile} className="p-1 rounded-full hover:bg-gray-600">
                           <CloseIcon className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <input
                        type="file"
                        ref={ref}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="application/pdf, image/png, image/jpeg, image/webp"
                    />
                    <button
                        type="button"
                        onClick={onUploadClick}
                        disabled={disabled}
                        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                       <PaperclipIcon className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Ask about Veteran benefits, or attach a document..."
                        disabled={disabled}
                        className="flex-1 bg-transparent py-2 pl-2 pr-12 text-gray-200 placeholder-gray-500 focus:outline-none"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={disabled || (!text.trim() && !file)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
});