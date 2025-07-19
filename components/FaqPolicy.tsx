
import React from 'react';

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
    <details className="bg-gray-800/50 border border-gray-700 rounded-lg group">
        <summary className="p-4 font-medium cursor-pointer flex justify-between items-center list-none">
            {question}
            <span className="transition-transform duration-300 transform group-open:rotate-180">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </span>
        </summary>
        <div className="p-4 border-t border-gray-700 text-slate-300 prose prose-invert prose-sm max-w-none">
            {children}
        </div>
    </details>
);

export const FaqPolicy: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 text-gray-200 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-8">
                
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <FaqItem question="Is Bennie an official Veteran Affairs (VA) tool?">
                            <p>No. Bennie is an independent, informational guide created to help Veterans understand the disability compensation system. It is not affiliated with, endorsed by, or sponsored by the U.S. Department of Veterans Affairs. All information should be verified on official government websites like Veteran.gov.</p>
                        </FaqItem>
                        <FaqItem question="Is my conversation private and secure?">
                             <p>Yes. Privacy is our top priority. Your conversation is temporary and is deleted when you close your browser tab. We do not store, log, or track your conversations. Please see the detailed Data Retention Policy below for more information.</p>
                        </FaqItem>
                         <FaqItem question="Can Bennie file my claim or appeal for me?">
                            <p>No. Bennie is an informational tool only. It cannot access your personal VA records, file claims on your behalf, or act as your legal representative. Its purpose is to explain the process, define complex terms, and guide you on what steps you can take yourself or with an accredited representative.</p>
                        </FaqItem>
                        <FaqItem question="What kind of documents can I upload?">
                            <p>You can upload documents in PDF, PNG, or JPG format. This feature is designed for analyzing documents like benefits decision letters, statements of case, or other correspondence from the VA. The AI can read the text in these documents to provide guidance tailored to your specific situation.</p>
                        </FaqItem>
                        <FaqItem question="What happens to my document after I upload it?">
                            <p>Your document is processed in your browser and is never stored on a server. Its contents are sent for a one-time analysis and are immediately discarded after a response is generated. Nothing is saved.</p>
                        </FaqItem>
                        <FaqItem question="Why does Bennie give so many disclaimers?">
                            <p>Bennie is legally and ethically bound to remind you that it is not a substitute for professional advice. The VA disability system has legal and medical complexities. The disclaimers are there to protect you and ensure you consult with accredited professionals (like a VSO or lawyer) and medical experts (like your doctor) for personal advice.</p>
                        </FaqItem>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Data Retention & Privacy Policy</h2>
                    <div className="space-y-4 text-slate-300 prose prose-invert prose-sm max-w-none">
                        <p>We are committed to protecting your privacy. This policy outlines how your data is handled when you use Bennie. Our guiding principle is to collect and process the absolute minimum amount of information necessary to provide the service, and to store nothing.</p>
                        
                        <h3 className="text-lg font-semibold text-white">Information We Process (And How)</h3>
                        <ul className="list-disc pl-5">
                            <li><strong>Chat Messages:</strong> The text you enter is sent to the Google Gemini API to generate a response. Your conversation history is maintained only for the current session and is not stored long-term.</li>
                            <li><strong>Uploaded Documents:</strong> When you upload a document, it is converted into a temporary, base64-encoded format in your browser. This data is sent along with your prompt to the Gemini API for a single analysis. <strong>The original file is never uploaded to a server, and the temporary data is immediately discarded after the analysis is complete.</strong></li>
                        </ul>

                        <h3 className="text-lg font-semibold text-white">Data Storage & Deletion</h3>
                        <p>Bennie is a "session-based" application. This means:</p>
                        <ul className="list-disc pl-5">
                            <li><strong>No Permanent Storage:</strong> We do not have a database that stores user data. Your chat history, uploaded files, and any other information are not logged or saved.</li>
                            <li><strong>Session-End Deletion:</strong> All data related to your interaction (chat messages, processed document data) is automatically and permanently deleted when you close your browser tab. There is no recovery mechanism.</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-white">Third-Party Services</h3>
                        <p>We use the Google Gemini API to power our chat and analysis features. While we send conversation content and document data for processing, we operate under their privacy policies. We do not provide them with any personal identifying information outside of what you include in your prompts or documents.</p>
                        
                        <h3 className="text-lg font-semibold text-white">Your Consent</h3>
                        <p>By using Bennie, and especially by using the document upload feature after agreeing to the privacy modal, you consent to this policy and our data handling practices.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};
