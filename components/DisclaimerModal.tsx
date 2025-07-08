import React from 'react';

interface DisclaimerModalProps {
  onAcknowledge: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAcknowledge }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-2xl max-w-lg w-full p-6 md:p-8 transform transition-all animate-fade-in-up">
        <h2 className="text-2xl font-bold text-navy dark:text-bennie-blue-dark mb-4">Hi! I'm Bennie, your guide to Veterans Disability Compensation.</h2>
        <div className="text-sm text-light-text dark:text-dark-text space-y-4">
          <p>Before you begin, please read this important information:</p>
          <ul className="list-disc list-inside space-y-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            <li>Bennie is an <strong>experimental AI assistant</strong>, not a human.</li>
            <li>This tool is <strong>not affiliated with, endorsed by, or sponsored by the U.S. Department of Veterans Affairs (VA)</strong> or any government agency.</li>
            <li>The information provided is for educational purposes and is <strong>not legal or medical advice</strong>. It may contain inaccuracies.</li>
            <li>Always verify information with official VA sources and consult with a <strong>VA-accredited representative</strong> for personal assistance with your claims.</li>
          </ul>
          <p>By clicking "Acknowledge," you confirm you have read and understood this disclaimer.</p>
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={onAcknowledge}
            className="bg-bennie-blue-light hover:bg-navy dark:bg-bennie-blue-dark dark:hover:bg-bennie-blue-light text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Acknowledge
          </button>
        </div>
      </div>
       <style>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
          }
        `}</style>
    </div>
  );
};
