
import React, { useState } from 'react';
import { ChevronDownIcon } from './Icons';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-4 px-2"
      >
        <h3 className="text-lg font-medium text-light-text dark:text-dark-text">{question}</h3>
        <ChevronDownIcon className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-2 pb-4 text-light-text-secondary dark:text-dark-text-secondary prose prose-sm max-w-none">
          <p dangerouslySetInnerHTML={{ __html: answer }}></p>
        </div>
      )}
    </div>
  );
};


const faqData: FAQItemProps[] = [
    {
        question: "What is VA disability compensation?",
        answer: "VA disability compensation is a tax-free monetary benefit paid to Veterans who are disabled by an injury or illness that was incurred or aggravated during active military service. These benefits are also paid to Veterans with disabilities that are considered service-connected, such as conditions that are presumed to be related to military service."
    },
    {
        question: "What does 'service-connected' mean?",
        answer: "Service connection means that a veteran's disability or death was incurred or aggravated by their military service. To establish service connection, you generally need to show three things: <br/>1) A current, diagnosed disability. <br/>2) An in-service event, injury, or illness. <br/>3) A medical 'nexus' or link connecting your current disability to the in-service event. Without all three, a claim will likely be denied."
    },
    {
        question: "How do I file a VA disability claim?",
        answer: "You can file a claim in several ways: <br/>- <strong>Online:</strong> The fastest and easiest way is through the VA.gov website. <br/>- <strong>By Mail:</strong> You can fill out VA Form 21-526EZ, 'Application for Disability Compensation and Related Compensation Benefits', and mail it to the VA's Evidence Intake Center. <br/>- <strong>In Person:</strong> At a VA regional office. <br/>- <strong>With Help:</strong> A trained professional, like a Veterans Service Officer (VSO), can help you file your claim for free."
    },
    {
        question: "What is a C&P exam?",
        answer: "A Compensation and Pension (C&P) exam is a medical examination requested by the VA to gather more information about your claimed condition. It is used by the VA to help determine the severity of your disability and whether it is service-connected. It is <strong>extremely important</strong> that you attend your C&P exam; failure to do so can result in your claim being denied."
    },
     {
        question: "What is a 'nexus letter' and do I need one?",
        answer: "A 'nexus letter' is an opinion from a qualified medical professional that explicitly links your disability to your military service. It provides the crucial 'nexus' (connection) between your current condition and an in-service event. While not always required by the VA, a strong, well-reasoned nexus letter can be one of the most powerful pieces of evidence to support your claim, especially for complex cases."
    },
    {
        question: "How are VA disability ratings determined?",
        answer: "The VA evaluates your disability based on a 'schedule for rating disabilities' (found in 38 CFR, Part 4). Each disability is assigned a percentage rating (from 0% to 100%) based on its severity. If you have multiple disabilities, the VA uses a special formula—often called 'VA Math'—to calculate your combined disability rating. It is important to know that this is <strong>not simple addition</strong>."
    },
     {
        question: "How is my combined disability rating calculated?",
        answer: "The VA calculates combined ratings using a method that considers the whole person. They start at 100% (an able-bodied person) and subtract your highest rating. For example, if you have a 50% rating, the VA considers you 50% disabled and 50% able. Your next rating is then calculated from the remaining 50% 'able' portion. This is why two 50% ratings result in a 75% combined rating (which the VA rounds to 80%), not 100%."
    },
    {
        question: "What is a 'presumptive condition'?",
        answer: "A presumptive condition is a medical condition that the VA automatically presumes was caused by military service because of unique circumstances of a specific time or location of service. For example, veterans exposed to Agent Orange in Vietnam or burn pits in the Gulf War may have certain diseases presumed to be service-connected. For these conditions, you do not need to provide a nexus linking it to your service, only prove you have the condition and served in the qualifying location and period."
    },
    {
        question: "What is TDIU?",
        answer: "Total Disability based on Individual Unemployability (TDIU) is a VA benefit that may allow a veteran to be paid at the 100% disability rate, even if their combined rating is less than 100%. To be eligible, you must be unable to maintain 'substantially gainful employment' as a result of your service-connected conditions."
    },
     {
        question: "What is a secondary service connection?",
        answer: "This is when a service-connected disability causes or aggravates another, different disability. The secondary disability may not be directly related to your military service but is a result of a condition that is. For example, if a service-connected knee injury leads to arthritis in your hip from an altered gait, the hip arthritis could be secondarily service-connected."
    },
    {
        question: "What if I disagree with the VA's decision?",
        answer: "If you disagree with a VA decision, you have three options under the Appeals Modernization Act (AMA):<br/>1) <strong>Supplemental Claim:</strong> If you have new and relevant evidence.<br/>2) <strong>Higher-Level Review:</strong> Ask a more senior reviewer to look at your case, with no new evidence.<br/>3) <strong>Board Appeal:</strong> Appeal directly to the Board of Veterans’ Appeals. Each lane has specific timelines and rules, so it's important to understand which is best for your situation."
    },
    {
        question: "What is a VSO and should I use one?",
        answer: "A Veterans Service Officer (VSO) is a trained professional who is accredited to represent veterans in their claims with the VA. They work for organizations like the VFW, DAV, and American Legion. Their services are <strong>completely free</strong>. Using a VSO is highly recommended, as they can provide expert advice, help gather evidence, and ensure your claim is filed correctly, greatly increasing your chances of success."
    },
];

export const FAQ: React.FC = () => {
  return (
    <div className="p-4 bg-light-card dark:bg-dark-card rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-navy dark:text-bennie-blue-dark">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqData.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
};
