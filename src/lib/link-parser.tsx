import React from 'react';

interface LinkParserProps {
  text: string;
  className?: string;
}

export function LinkParser({ text, className }: LinkParserProps) {
  // URL regex pattern to match http/https URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Function to clean URL by removing trailing punctuation
  const cleanUrl = (url: string): string => {
    // Remove common trailing punctuation that might break links
    return url.replace(/[.,;:!?]+$/, '');
  };
  
  // Split text by URLs and create array of text and URL parts
  const parts = text.split(urlRegex);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Check if this part is a URL
        if (urlRegex.test(part)) {
          const cleanUrlValue = cleanUrl(part);
          return (
            <a
              key={index}
              href={cleanUrlValue}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline transition-colors"
            >
              {part}
            </a>
          );
        }
        // Regular text
        return part;
      })}
    </span>
  );
}
