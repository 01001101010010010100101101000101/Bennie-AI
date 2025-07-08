import React from 'react';
import { SunIcon, MoonIcon } from './Icons';
import { View } from '../types';

interface HeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    activeView: View;
    setActiveView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode, activeView, setActiveView }) => {
    const navItems = [View.Chat, View.FAQ, View.Forms];
    
    return (
        <header className="bg-light-card dark:bg-dark-card shadow-md sticky top-0 z-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex justify-between items-center py-4">
                    <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-bennie-blue-dark">
                        Bennie <span className="text-light-text-secondary dark:text-dark-text-secondary font-normal hidden sm:inline">| Your Guide to Veterans Disability Compensation</span>
                    </h1>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? <SunIcon className="w-6 h-6 text-bennie-gold" /> : <MoonIcon className="w-6 h-6 text-navy" />}
                        </button>
                    </div>
                </div>
                <nav className="border-t border-gray-200 dark:border-gray-700">
                    <ul className="flex space-x-4">
                        {navItems.map(view => (
                            <li key={view}>
                                <button
                                    onClick={() => setActiveView(view)}
                                    className={`py-3 px-1 text-sm md:text-base font-medium transition-colors ${
                                        activeView === view
                                        ? 'border-b-2 border-bennie-blue-light dark:border-bennie-blue-dark text-bennie-blue-light dark:text-bennie-blue-dark'
                                        : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'
                                    }`}
                                >
                                    {view}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
};