import React from 'react';

interface LinkParserProps {
  text: string;
  className?: string;
}

export function LinkParser({ text, className }: LinkParserProps) {
  // Markdown link pattern: [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  // Raw URL pattern: http/https URLs
  const urlRegex = /(https?:\/\/[^\s<>"\])}]+)/g;
  
  // Function to clean URL by removing trailing punctuation
  const cleanUrl = (url: string): string => {
    // Remove common trailing punctuation that might break links
    return url.replace(/[.,;:!?)]+$/, '');
  };

  // First, process markdown links
  const processedParts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let match;

  // Reset regex lastIndex
  markdownLinkRegex.lastIndex = 0;

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    // Add text before the markdown link
    if (match.index > lastIndex) {
      processedParts.push(text.slice(lastIndex, match.index));
    }

    const linkText = match[1];
    const linkUrl = cleanUrl(match[2]);

    // Add the markdown link as a clickable element
    processedParts.push(
      <a
        key={`md-${match.index}`}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 transition-colors font-medium"
      >
        {linkText}
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last markdown link
  if (lastIndex < text.length) {
    processedParts.push(text.slice(lastIndex));
  }

  // If no markdown links were found, use the original text
  if (processedParts.length === 0) {
    processedParts.push(text);
  }

  // Now process raw URLs in the remaining text parts
  const finalParts: (string | React.ReactElement)[] = [];

  processedParts.forEach((part, partIndex) => {
    if (typeof part === 'string') {
      // Split this text part by URLs
      const urlParts = part.split(urlRegex);
      
      urlParts.forEach((urlPart, urlIndex) => {
        if (urlRegex.test(urlPart)) {
          // Reset regex after test
          urlRegex.lastIndex = 0;
          
          const cleanUrlValue = cleanUrl(urlPart);
          finalParts.push(
            <a
              key={`url-${partIndex}-${urlIndex}`}
              href={cleanUrlValue}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 transition-colors break-all"
            >
              {cleanUrlValue}
            </a>
          );
        } else if (urlPart) {
          finalParts.push(urlPart);
        }
      });
      
      // Reset regex for next iteration
      urlRegex.lastIndex = 0;
    } else {
      // It's already a React element (markdown link), keep as is
      finalParts.push(part);
    }
  });

  return (
    <span className={className}>
      {finalParts.map((part, index) => (
        <React.Fragment key={index}>{part}</React.Fragment>
      ))}
    </span>
  );
}
