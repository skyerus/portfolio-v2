'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import classes from './CodeBlock.module.css';

interface CodeBlockProps {
  children: any;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Function to recursively extract text from the MDX/syntax highlighting structure
    const extractText = (node: any): string => {
      if (typeof node === 'string') return node;
      if (Array.isArray(node)) return node.map(extractText).join('');
      if (node?.props?.children) return extractText(node.props.children);
      return '';
    };

    const codeText = extractText(children);
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={classes.codeBlockWrapper}>
      <pre className={className}>
        <code>{children}</code>
      </pre>
      <Tooltip label={copied ? "Copied!" : "Copy to clipboard"}>
        <ActionIcon
          variant="subtle"
          onClick={handleCopy}
          className={classes.copyButton}
          aria-label="Copy to clipboard"
          c="gray.0"
        >
          {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
        </ActionIcon>
      </Tooltip>
    </div>
  );
} 