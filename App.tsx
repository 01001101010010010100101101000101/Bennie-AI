import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ChatInterface } from './components/ChatInterface';
import { FAQ } from './components/FAQ';
import { Forms } from './components/Forms';
import { DisclaimerModal } from './components/DisclaimerModal';
import { View } from './types';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  
  const [activeView, setActiveView] = useState<View>(View.Chat);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem('hasSeenDisclaimer');
    if (!hasSeenDisclaimer) {
      setShowDisclaimer(true);
    }
  }, []);

  // Scroll to top when view changes to prevent being scrolled down from a long page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  const handleDisclaimerAcknowledge = () => {
    localStorage.setItem('hasSeenDisclaimer', 'true');
    setShowDisclaimer(false);
    window.scrollTo(0, 0);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-light-text dark:text-dark-text">
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
        activeView={activeView}
        setActiveView={setActiveView} 
      />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div style={{ display: activeView === View.Chat ? 'block' : 'none' }}>
          <ChatInterface />
        </div>
        <div style={{ display: activeView === View.FAQ ? 'block' : 'none' }}>
          <FAQ />
        </div>
        <div style={{ display: activeView === View.Forms ? 'block' : 'none' }}>
          <Forms />
        </div>
      </main>
      <Footer />
      {showDisclaimer && <DisclaimerModal onAcknowledge={handleDisclaimerAcknowledge} />}
    </div>
  );
};

export default App;