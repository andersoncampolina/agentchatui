'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FormatMarkdownProps {
  children: string;
}

const FormatMarkdown: React.FC<FormatMarkdownProps> = ({ children }) => {
  return (
    <div className="markdown-content prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className={`bg-[var(--quaternary-color)] text-[var(--primary-color)] px-1 rounded ${className}`}
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ node, ...props }: any) => (
            <h1
              className="text-2xl font-bold my-4 text-[var(--primary-color)]"
              {...props}
            />
          ),
          h2: ({ node, ...props }: any) => (
            <h2
              className="text-xl font-bold my-3 text-[var(--secondary-color)]"
              {...props}
            />
          ),
          h3: ({ node, ...props }: any) => (
            <h3
              className="text-lg font-bold my-2 text-[var(--secondary-color)]"
              {...props}
            />
          ),
          h4: ({ node, ...props }: any) => (
            <h4
              className="text-base font-bold my-2 text-[var(--tertiary-color)]"
              {...props}
            />
          ),
          p: ({ node, ...props }: any) => (
            <p className="my-2 text-[var(--tertiary-color)]" {...props} />
          ),
          ul: ({ node, ...props }: any) => (
            <ul
              className="list-disc pl-6 my-2 text-[var(--tertiary-color)]"
              {...props}
            />
          ),
          ol: ({ node, ...props }: any) => (
            <ol
              className="list-decimal pl-6 my-2 text-[var(--tertiary-color)]"
              {...props}
            />
          ),
          li: ({ node, ...props }: any) => (
            <li className="my-1 text-[var(--tertiary-color)]" {...props} />
          ),
          a: ({ node, ...props }: any) => (
            <a
              className="text-[var(--primary-color)] hover:underline"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }: any) => (
            <blockquote
              className="border-l-4 border-[var(--quaternary-color)] pl-4 italic my-2 text-[var(--tertiary-color)]"
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
