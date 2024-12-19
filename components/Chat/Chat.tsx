'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Paper, Text, Stack, Group, ActionIcon, ScrollArea, TextInput, Modal, Loader } from '@mantine/core';
import { IconMessageCircle, IconX, IconSend } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import classes from './Chat.module.css';

const INTRO_MESSAGE = "Hi! I'm Skye's AI assistant. I can tell you all about Skye's experience, projects, and interests. Feel free to ask me anything!";
const BUTTON_TEXT = "Chat with my AI";
const TYPING_SPEED = 15;

interface Message {
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

interface ChatContentProps {
  messages: Message[];
  streamingMessage: Message | null;
  displayedContent: string;
  isLoading: boolean;
  userInput: string;
  isMobile: boolean;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  onMinimize: () => void;
  onSendMessage: () => void;
  onInputChange: (value: string) => void;
}

const ChatContent = memo(({
  messages,
  streamingMessage,
  displayedContent,
  isLoading,
  userInput,
  isMobile,
  scrollAreaRef,
  inputRef,
  onMinimize,
  onSendMessage,
  onInputChange,
}: ChatContentProps) => {
  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSendMessage();
    }
  }, [onSendMessage]);

  const ChatInput = (
    <TextInput
      ref={inputRef}
      placeholder="Ask me anything..."
      value={userInput}
      onChange={(e) => onInputChange(e.currentTarget.value)}
      onKeyDown={handleKeyPress}
      disabled={isLoading || !!streamingMessage}
      rightSection={
        <ActionIcon 
          variant="subtle" 
          onClick={onSendMessage}
          disabled={!userInput.trim() || isLoading || !!streamingMessage}
          color="gray.0"
        >
          <IconSend size={16} />
        </ActionIcon>
      }
    />
  );

  return (
    <Stack gap={0} h="100%" style={{ position: 'relative' }}>
      <ActionIcon
        variant="subtle"
        onClick={onMinimize}
        title="Close"
        color="gray.0"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <IconX size={18} />
      </ActionIcon>

      <ScrollArea 
        h={isMobile ? "calc(100vh - 80px)" : "calc(400px - 60px)"}
        ref={scrollAreaRef}
        pt={0}
      >
        <Stack gap="xs">
          {messages.map((message, index) => (
            <Paper 
              key={index} 
              className={classes.messageContainer} 
              p="md" 
              radius="md"
              style={{
                marginLeft: message.role === 'user' ? 'auto' : 0,
                marginRight: message.role === 'assistant' ? 'auto' : 0,
                maxWidth: '80%',
              }}
            >
              <Text c="gray.0">{message.content}</Text>
            </Paper>
          ))}
          {streamingMessage && (
            <Paper 
              className={classes.messageContainer} 
              p="md" 
              radius="md"
              style={{
                marginRight: 'auto',
                maxWidth: '80%',
              }}
            >
              <Text c="gray.0">{displayedContent}</Text>
            </Paper>
          )}
          {isLoading && !streamingMessage && (
            <Paper 
              className={classes.messageContainer} 
              p="md" 
              radius="md"
              style={{
                marginRight: 'auto',
                maxWidth: '80%',
              }}
            >
              <Loader size="sm" />
            </Paper>
          )}
        </Stack>
      </ScrollArea>

      <Paper
        style={{
          padding: '10px',
          background: 'var(--mantine-color-dark-7)',
          marginTop: 'auto',
        }}
      >
        {ChatInput}
      </Paper>
    </Stack>
  );
});

ChatContent.displayName = 'ChatContent';

export function Chat() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [displayedButtonText, setDisplayedButtonText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    content: INTRO_MESSAGE,
    role: 'assistant',
    created_at: new Date().toISOString()
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  const [displayedContent, setDisplayedContent] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamingTimeoutRef = useRef<NodeJS.Timeout>();
  const isMobile = useMediaQuery('(max-width: 48em)');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        const response = await fetch(`${baseUrl}/api/v1/chat_messages`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(prev => data ? [prev[0], ...data] : prev);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (!isMinimized) {
      setTimeout(() => {
        if (scrollAreaRef.current) {
          const viewport = scrollAreaRef.current.querySelector('.mantine-ScrollArea-viewport');
          if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
          }
        }
      }, 100);
    }
  }, [isMinimized]);

  useEffect(() => {
    let buttonIndex = 0;
    const buttonIntervalId = setInterval(() => {
      if (buttonIndex <= BUTTON_TEXT.length) {
        setDisplayedButtonText(BUTTON_TEXT.slice(0, buttonIndex));
        buttonIndex++;
      } else {
        clearInterval(buttonIntervalId);
      }
    }, 50);

    return () => clearInterval(buttonIntervalId);
  }, []);

  useEffect(() => {
    if (streamingMessage) {
      let index = 0;
      
      const streamText = () => {
        if (index <= streamingMessage.content.length) {
          setDisplayedContent(streamingMessage.content.slice(0, index));
          index++;
          
          if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('.mantine-ScrollArea-viewport');
            if (viewport) {
              viewport.scrollTop = viewport.scrollHeight;
            }
          }
          
          streamingTimeoutRef.current = setTimeout(streamText, TYPING_SPEED);
        } else {
          setMessages(prev => [...prev, { ...streamingMessage, content: streamingMessage.content }]);
          setStreamingMessage(null);
          setDisplayedContent('');
        }
      };
      
      streamText();
      
      return () => {
        if (streamingTimeoutRef.current) {
          clearTimeout(streamingTimeoutRef.current);
        }
      };
    }
  }, [streamingMessage]);

  const handleSendMessage = useCallback(async () => {
    if (userInput.trim()) {
      const messageContent = userInput;
      setUserInput('');
      
      const userMessage: Message = {
        content: messageContent,
        role: 'user',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);
      
      setIsLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        const response = await fetch(`${baseUrl}/api/v1/chat_message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ content: messageContent }),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const data = await response.json();
        setStreamingMessage(data);
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    }
  }, [userInput]);

  const handleInputChange = useCallback((value: string) => {
    setUserInput(value);
  }, []);

  if (isMinimized) {
    return (
      <Group 
        className={classes.chatButton} 
        gap="xs" 
        wrap="nowrap"
        onClick={() => setIsMinimized(false)}
      >
        <IconMessageCircle size={20} stroke={1.5} />
        {displayedButtonText && (
          <Text c="dark.7" size="sm" style={{ whiteSpace: 'nowrap' }}>
            {displayedButtonText}
          </Text>
        )}
      </Group>
    );
  }

  const chatContentProps = {
    messages,
    streamingMessage,
    displayedContent,
    isLoading,
    userInput,
    isMobile: isMobile || false,
    scrollAreaRef,
    inputRef,
    onMinimize: () => setIsMinimized(true),
    onSendMessage: handleSendMessage,
    onInputChange: handleInputChange,
  };

  if (isMobile) {
    return (
      <Modal 
        opened={!isMinimized}
        onClose={() => setIsMinimized(true)}
        fullScreen
        transitionProps={{ transition: 'slide-up' }}
        withCloseButton={false}
      >
        <ChatContent {...chatContentProps} />
      </Modal>
    );
  }

  return (
    <Paper
      className={classes.chatContainer}
      shadow="md"
      pb="md"
      px="md"
      w={400}
    >
      <ChatContent {...chatContentProps} />
    </Paper>
  );
}