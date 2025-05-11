'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FormatMarkdownProps {
  children: string;
  isHumanMessage?: boolean;
}

const FormatMarkdown: React.FC<FormatMarkdownProps> = ({
  children,
  isHumanMessage,
}) => {
  const textColor = isHumanMessage ? 'text-white' : 'text-black';

  return (
    <div className="bg-transparent markdown-content prose prose-sm md:prose-base lg:prose-lg w-full max-w-full overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="bg-transparent overflow-x-auto w-full max-w-[95vw] sm:max-w-full">
                <SyntaxHighlighter
                  style={coldarkCold as any}
                  customStyle={{
                    backgroundColor: 'transparent',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--quaternary-color)',
                    fontSize: '0.85rem',
                    maxWidth: '100%',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                  wrapLongLines={true}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className={`bg-[var(--quaternary-color)] ${textColor} px-1 rounded ${className} break-words`}
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ node, ...props }: any) => (
            <h1
              className={`bg-transparent text-xl md:text-2xl font-bold my-3 md:my-4 ${textColor}`}
              {...props}
            />
          ),
          h2: ({ node, ...props }: any) => (
            <h2
              className={`bg-transparent text-lg md:text-xl font-bold my-2 md:my-3 ${textColor}`}
              {...props}
            />
          ),
          h3: ({ node, ...props }: any) => (
            <h3
              className={`bg-transparent text-base md:text-lg font-bold my-2 ${textColor}`}
              {...props}
            />
          ),
          h4: ({ node, ...props }: any) => (
            <h4
              className={`bg-transparent text-sm md:text-base font-bold my-1 md:my-2 ${textColor}`}
              {...props}
            />
          ),
          p: ({ node, ...props }: any) => (
            <p
              className={`bg-transparent my-2 ${textColor} break-words max-w-full overflow-hidden`}
              {...props}
            />
          ),
          ul: ({ node, ...props }: any) => (
            <ul
              className={`bg-transparent list-disc pl-4 md:pl-6 my-2 ${textColor}`}
              {...props}
            />
          ),
          ol: ({ node, ...props }: any) => (
            <ol
              className={`bg-transparent list-decimal pl-4 md:pl-6 my-2 ${textColor}`}
              {...props}
            />
          ),
          li: ({ node, ...props }: any) => (
            <li
              className={`bg-transparent my-1 ${textColor} break-words`}
              {...props}
            />
          ),
          a: ({ node, ...props }: any) => (
            <a
              className={`bg-transparent ${textColor} hover:underline break-words`}
              {...props}
            />
          ),
          blockquote: ({ node, ...props }: any) => (
            <blockquote
              className={`bg-transparent border-l-4 border-[var(--tertiary-color)] pl-2 md:pl-4 italic my-2 ${textColor} overflow-hidden`}
              {...props}
            />
          ),
          img: ({ node, ...props }: any) => (
            <img
              className="bg-transparent max-w-full h-auto rounded-md my-2"
              {...props}
            />
          ),
          table: ({ node, ...props }: any) => (
            <div className="bg-transparent overflow-x-auto w-full my-2 max-w-[95vw] sm:max-w-full">
              <table
                className={`bg-transparent w-full border-collapse ${textColor}`}
                {...props}
              />
            </div>
          ),
          pre: ({ node, ...props }: any) => (
            <pre
              className={`bg-transparent overflow-x-auto max-w-[95vw] sm:max-w-full break-words whitespace-pre-wrap ${textColor}`}
              {...props}
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default FormatMarkdown;
