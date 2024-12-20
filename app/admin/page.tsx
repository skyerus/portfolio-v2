'use client'

import { TextInput, Button, Stack, Container, Paper } from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { App } from '@/components/App/App';
export default function AdminPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/v1/auth/knowledge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
        },
        body: JSON.stringify({ question, answer }),
      });

      if (!response.ok) {
        throw new Error('Failed to add knowledge');
      }

      notifications.show({
        title: 'Success',
        message: 'Knowledge added successfully',
        color: 'green',
      });

      // Clear form
      setQuestion('');
      setAnswer('');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to add knowledge',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <App>
<Container size="sm" py="xl">
        <Paper shadow="md" p="md" radius="md" withBorder>
          <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Question"
              placeholder="Enter the question"
              value={question}
              onChange={(e) => setQuestion(e.currentTarget.value)}
              required
            />
            <TextInput
              label="Answer"
              placeholder="Enter the answer"
              value={answer}
              onChange={(e) => setAnswer(e.currentTarget.value)}
              required
            />
            <TextInput
              label="API Key"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.currentTarget.value)}
              type="password"
              required
            />
            <Button type="submit" loading={isLoading}>
              Add Knowledge
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
    </App>
  );
}
