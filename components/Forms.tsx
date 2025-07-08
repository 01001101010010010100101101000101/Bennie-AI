import React from 'react';
import { LinkIcon } from './Icons';

interface FormInfo {
  number: string;
  title: string;
  description: string;
  url: string;
}

const formsData: FormInfo[] = [
    {
        number: "VA Form 21-526EZ",
        title: "Application for Disability Compensation",
        description: "The primary form used to apply for VA disability benefits for the first time.",
        url: "https://www.va.gov/find-forms/about-form-21-526ez/"
    },
    {
        number: "VA Form 21-0966",
        title: "Intent to File a Claim",
        description: "Notifies the VA of your intent to file. This can establish an earlier effective date for your benefits.",
        url: "https://www.va.gov/find-forms/about-form-21-0966/"
    },
    {
        number: "VA Form 20-0995",
        title: "Supplemental Claim",
        description: "Submit new and relevant evidence to have a previously denied claim reviewed again.",
        url: "https://www.va.gov/find-forms/about-form-20-0995/"
    },
    {
        number: "VA Form 20-0996",
        title: "Higher-Level Review",
        description: "Request a review of the same evidence by a senior claims adjudicator if you disagree with the initial decision.",
        url: "https://www.va.gov/find-forms/about-form-20-0996/"
    },
    {
        number: "VA Form 10182",
        title: "Notice of Disagreement (Board Appeal)",
        description: "Appeal your case directly to the Board of Veterans’ Appeals. This is one of three appeal options.",
        url: "https://www.va.gov/find-forms/about-form-10182/"
    },
    {
        number: "VA Form 21-8940",
        title: "Application for Unemployability (TDIU)",
        description: "Apply for benefits at the 100% rate if your service-connected disabilities prevent you from working.",
        url: "https://www.va.gov/find-forms/about-form-21-8940/"
    },
    {
        number: "VA Form 21-4142",
        title: "Authorization to Disclose Information",
        description: "Authorizes your private medical providers to release your records directly to the VA to support your claim.",
        url: "https://www.va.gov/find-forms/about-form-21-4142/"
    },
    {
        number: "VA Form 21-22",
        title: "Appointment of VSO as Representative",
        description: "Formally appoint a Veterans Service Organization (VSO) to help you prepare and submit your claim.",
        url: "https://www.va.gov/find-forms/about-form-21-22/"
    },
];

const FormCard: React.FC<FormInfo> = ({ number, title, description, url }) => (
  <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col shadow-sm hover:shadow-md transition-shadow">
    <h3 className="text-lg font-bold text-navy dark:text-bennie-blue-dark">{number}</h3>
    <p className="text-md font-semibold text-light-text dark:text-dark-text mt-1">{title}</p>
    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2 flex-grow">{description}</p>
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-bennie-blue-light text-white font-semibold rounded-lg hover:bg-navy dark:bg-bennie-blue-dark dark:hover:bg-bennie-blue-light transition-colors duration-300"
    >
      <LinkIcon className="w-4 h-4 mr-2" />
      View Form on VA.gov
    </a>
  </div>
);

export const Forms: React.FC = () => {
  return (
    <div className="p-4 bg-light-card dark:bg-dark-card rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-navy dark:text-bennie-blue-dark">Common VA Disability Forms</h2>
      <p className="mb-8 text-light-text-secondary dark:text-dark-text-secondary">
        Here are direct links to some of the most common forms used in the VA disability compensation process. Always ensure you are using the most current version of a form by downloading it directly from VA.gov.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formsData.map((form) => (
          <FormCard key={form.number} {...form} />
        ))}
      </div>
    </div>
  );
};