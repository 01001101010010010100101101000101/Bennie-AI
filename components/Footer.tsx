
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-light-card dark:bg-dark-card mt-8 py-6 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 max-w-4xl text-center text-xs text-light-text-secondary dark:text-dark-text-secondary">
        <p className="font-bold mb-2">DISCLAIMER</p>
        <p>
          Bennie is an experimental AI assistant and is not affiliated with, endorsed by, or sponsored by the U.S. Department of Veterans Affairs or any other government agency.
          The information provided is for informational purposes only and does not constitute legal or medical advice.
          Always consult with a qualified professional or a VA-accredited representative for personal advice.
        </p>
        <p className="mt-2">
          &copy; {new Date().getFullYear()} Bennie Assistant. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
