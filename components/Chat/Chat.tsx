'use client'

import { useState, useEffect } from 'react';
import { Paper, Button, Text, Stack, Group, ActionIcon, ScrollArea, TextInput, Container } from '@mantine/core';
import { IconMessageCircle, IconMinimize, IconMaximize, IconX, IconSend } from '@tabler/icons-react';
import classes from './Chat.module.css';

const DEFAULT_QUESTIONS = [
  'Tell me about yourself?',
  'What are your technical skills?',
  'What projects have you worked on?',
  'Do you have any blog posts?',
];

const INTRO_MESSAGE = "Hi! I'm Skye's AI assistant. I can tell you all about Skye's experience, projects, and interests. Feel free to ask me anything or choose from the quick questions below!";

export function Chat() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullyMinimized, setIsFullyMinimized] = useState(false);
  const [displayedIntro, setDisplayedIntro] = useState('');
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index <= INTRO_MESSAGE.length) {
        setDisplayedIntro(INTRO_MESSAGE.slice(0, index));
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 15); // Adjust speed of typing

    return () => clearInterval(intervalId);
  }, []);

  const handleSendMessage = () => {
    if (userInput.trim()) {
      console.log('Sending message:', userInput);
      setUserInput('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (isFullyMinimized) {
    return (
      <ActionIcon
        className={classes.chatButton}
        variant="filled"
        size="xl"
        color="blue"
        onClick={() => setIsFullyMinimized(false)}
      >
        <IconMessageCircle size={24} />
      </ActionIcon>
    );
  }

  const containerSize = {
    xs: '100%',
    sm: '100%',
    md: '700px',
    lg: '800px',
    xl: '800px'
  };

  return (
    <Paper
      className={`${classes.chatContainer} ${isMinimized ? classes.minimized : ''}`}
      shadow="md"
      p="md"
      w={containerSize}
    >
      <Stack gap="xs" h="100%">
        <Container size={containerSize} h="100%" p={0}>
          <Stack h="100%" justify="space-between">
            <Stack gap="xs">
              <Group justify="flex-end">
                <ActionIcon
                  variant="subtle"
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  {isMinimized ? <IconMaximize size={18} /> : <IconMinimize size={18} />}
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  onClick={() => setIsFullyMinimized(true)}
                  title="Close"
                >
                  <IconX size={18} />
                </ActionIcon>
              </Group>

              <ScrollArea h={isMinimized ? 200 : "calc(100vh - 200px)"}>
                <Paper p="md" radius="md" withBorder>
                  <Text>{displayedIntro}</Text>
                </Paper>
              </ScrollArea>
            </Stack>

            <Stack gap="xs">
              <Group gap="xs" wrap="wrap">
                {DEFAULT_QUESTIONS.map((question, index) => (
                  <Button
                    key={index}
                    variant="light"
                    size="xs"
                    onClick={() => {
                      setUserInput(question);
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </Group>

              <TextInput
                placeholder="Ask me anything..."
                value={userInput}
                onChange={(event) => setUserInput(event.currentTarget.value)}
                onKeyDown={handleKeyPress}
                rightSection={
                  <ActionIcon
                    variant="subtle" 
                    onClick={handleSendMessage}
                    disabled={!userInput.trim()}
                  >
                    <IconSend size={16} />
                  </ActionIcon>
                }
              />
            </Stack>
          </Stack>
        </Container>
      </Stack>
    </Paper>
  );
}
