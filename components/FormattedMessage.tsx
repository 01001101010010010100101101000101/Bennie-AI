import React from 'react';

interface FormattedMessageProps {
  text: string;
}

/**
 * A simple recursive markdown parser that handles links, bold, and italics.
 * It processes a string and returns an array of strings and JSX elements.
 * @param text The string to parse.
 * @returns An array of strings and JSX elements.
 */
const parseMarkdown = (text: string): React.ReactNode[] => {
    // Regex for [link](url), **bold**, and *italic*
    // The order is important: process links, then bold, then italic to avoid conflicts.
    const markdownRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+?)\*\*|\*([^*]+?)\*/g;
    
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = markdownRegex.exec(text)) !== null) {
        // 1. Add the plain text part before the match
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }

        const [, linkText, linkUrl, boldText, italicText] = match;

        // 2. Add the matched element, recursively parsing its content
        if (linkText && linkUrl) {
            parts.push(
                <a
                    key={match.index}
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline font-medium"
                >
                    {parseMarkdown(linkText)}
                </a>
            );
        } else if (boldText) {
            parts.push(<strong key={match.index}>{parseMarkdown(boldText)}</strong>);
        } else if (italicText) {
            parts.push(<em key={match.index}>{parseMarkdown(italicText)}</em>);
        }

        lastIndex = markdownRegex.lastIndex;
    }

    // 3. Add any remaining plain text after the last match
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }
    
    return parts;
};

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ text }) => {
  return (
    <>
      {text.split('\n').map((paragraph, pIndex) => {
        if (paragraph.trim() === '') {
            return <div key={pIndex} className="h-4" />; // Represents a blank line for spacing
        }
        
        return (
          <p key={pIndex} className="mb-3 last:mb-0">
            {parseMarkdown(paragraph)}
          </p>
        );
      })}
    </>
  );
};
