'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Paper, Text, Stack, Group, ActionIcon, ScrollArea, TextInput, Modal, Loader, Button } from '@mantine/core';
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
  onInputBlur: () => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setStreamingMessage: React.Dispatch<React.SetStateAction<Message | null>>;
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
  onInputBlur,
  setMessages,
  setIsLoading,
  setStreamingMessage,
}: ChatContentProps) => {
  const [emailModalOpened, setEmailModalOpened] = useState(false);
  const [email, setEmail] = useState('');

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSendMessage();
    }
  }, [onSendMessage]);

  const handleInputFocus = useCallback(() => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('.mantine-ScrollArea-viewport');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    }, 200);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('.mantine-ScrollArea-viewport');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

  const ChatInput = (
    <>
      <Modal
        opened={emailModalOpened}
        onClose={() => setEmailModalOpened(false)}
        title="Notify Skye"
        size="sm"
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          const messageContent = `Ask Skye - ${email}`;
          const userMessage: Message = {
            content: messageContent,
            role: 'user',
            created_at: new Date().toISOString()
          };
          setMessages(prev => [...prev, userMessage]);
          setEmailModalOpened(false);
          setEmail('');
          
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
          }
        }}>
          <Stack>
            <TextInput
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              type="email"
              required
            />
            <Text size="xs" c="dimmed">
              By submitting, you agree to share your chat transcript with Skye. He will review and respond via email.
            </Text>
            <Button 
              type="submit"
              style={{
                background: 'linear-gradient(45deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-violet-6) 100%)'
              }}
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Modal>
      <TextInput
        ref={inputRef}
        placeholder="Ask me anything..."
        value={userInput}
        onChange={(e) => onInputChange(e.currentTarget.value)}
        onKeyDown={handleKeyPress}
        onFocus={handleInputFocus}
        onBlur={onInputBlur}
        disabled={isLoading || !!streamingMessage}
        styles={{
          input: {
            fontSize: isMobile ? '16px' : undefined,
          }
        }}
        leftSection={
          <ActionIcon
            variant="subtle"
            onClick={() => setEmailModalOpened(true)}
            title="Ask Skye directly"
            style={{
              background: 'linear-gradient(45deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-violet-6) 100%)',
              color: 'white'
            }}
            size="sm"
          >
            <IconMessageCircle size={16} />
          </ActionIcon>
        }
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
    </>
  );

  return (
    <Stack gap={0} h="100%" style={{ 
      position: 'relative', 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      maxHeight: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))'
    }}>
      <ActionIcon
        variant="subtle"
        onClick={onMinimize}
        title="Close"
        color="gray.0"
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 10,
        }}
      >
        <IconX size={18} />
      </ActionIcon>

      <ScrollArea 
        className={classes.scrollArea}
        style={{ 
          flex: 1, 
          overflow: 'auto',
        }}
        ref={scrollAreaRef}
        styles={{
          viewport: {
            display: 'flex',
            flexDirection: 'column',
          }
        }}
      >
        <Stack 
          gap="xs" 
          p={{ base: 'xs', sm: 'md' }}
        >
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
        className={classes.inputContainer}
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
  const [isInputFocused, setIsInputFocused] = useState(false);

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
        setMessages(prev => data ? [...data, prev[0]] : prev);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const initialVh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${initialVh}px`);
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
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }
    }
  }, [userInput]);

  const handleInputChange = useCallback((value: string) => {
    setUserInput(value);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true);
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('.mantine-ScrollArea-viewport');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    }, 200);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false);
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
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
    onInputBlur: handleInputBlur,
    setMessages,
    setIsLoading,
    setStreamingMessage,
  };

  if (isMobile) {
    return (
      <Modal 
        opened={!isMinimized}
        onClose={() => setIsMinimized(true)}
        fullScreen
        transitionProps={{ transition: 'slide-up' }}
        withCloseButton={false}
        styles={{
          inner: {
            padding: 0,
          },
          content: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--mantine-color-dark-7)',
          },
          body: {
            flex: 1,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
          },
        }}
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