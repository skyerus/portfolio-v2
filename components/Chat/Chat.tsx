'use client'

import { useState, useEffect } from 'react';
import { Paper, Button, Text, Stack, Group, ActionIcon, ScrollArea, TextInput, Modal } from '@mantine/core';
import { IconMessageCircle, IconX, IconSend } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import classes from './Chat.module.css';

const DEFAULT_QUESTIONS = [
  'Skills',
  'Projects',
  'Blog',
];

const INTRO_MESSAGE = "Hi! I'm Skye's AI assistant. I can tell you all about Skye's experience, projects, and interests. Feel free to ask me anything or choose from the suggestions below!";
const BUTTON_TEXT = "Chat with my AI";

export function Chat() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [displayedIntro, setDisplayedIntro] = useState('');
  const [displayedButtonText, setDisplayedButtonText] = useState('');
  const [userInput, setUserInput] = useState('');
  const isMobile = useMediaQuery('(max-width: 48em)');

  useEffect(() => {
    // Animate button text first
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
    let index = 0;
    const intervalId = setInterval(() => {
      if (index <= INTRO_MESSAGE.length) {
        setDisplayedIntro(INTRO_MESSAGE.slice(0, index));
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 15);

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

  const ChatContent = () => (
    <Stack gap="xs" h="100%">
      <Group justify="flex-end">
        <ActionIcon
          variant="subtle"
          onClick={() => setIsMinimized(true)}
          title="Close"
          color="gray.0"
        >
          <IconX size={18} />
        </ActionIcon>
      </Group>

      <ScrollArea h={isMobile ? "calc(100vh - 200px)" : 300}>
        <Paper className={classes.messageContainer} p="md" radius="md">
          <Text c="gray.0">{displayedIntro}</Text>
        </Paper>
      </ScrollArea>

      <Stack gap="xs">
        <Group wrap="nowrap">
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
              color="gray.0"
            >
              <IconSend size={16} />
            </ActionIcon>
          }
        />
      </Stack>
    </Stack>
  );

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

  if (isMobile) {
    return (
      <Modal 
        opened={!isMinimized}
        onClose={() => setIsMinimized(true)}
        fullScreen
        transitionProps={{ transition: 'slide-up' }}
        withCloseButton={false}
      >
        <ChatContent />
      </Modal>
    );
  }

  return (
    <Paper
      className={classes.chatContainer}
      shadow="md"
      p="md"
      w={400}
    >
      <ChatContent />
    </Paper>
  );
}
