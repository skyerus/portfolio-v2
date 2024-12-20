'use client'

import { Container, Title, TextInput, Textarea, Button, Paper, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import classes from './Contact.module.css';

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export function Contact() {
  const form = useForm<ContactFormValues>({
    initialValues: {
      name: '',
      email: '',
      message: ''
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      message: (value) => (value.length < 10 ? 'Message must be at least 10 characters' : null),
    },
  });

  const handleSubmit = async (values: ContactFormValues) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      notifications.show({
        title: 'Success',
        message: 'Message sent successfully',
        color: 'green',
      });

      form.reset();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to send message',
        color: 'red',
      });
    }
  };

  return (
    <Container py="xl">
      <Paper shadow="md" radius="lg" maw={{ base: '100%', md: '60%' }} p={{ base: 0, md: 'xl' }} className={classes.form}>
        <Stack gap="lg">
          <Title order={2} ta="center" c="gray.0">
            Get in Touch
          </Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Name"
                placeholder="Your name"
                {...form.getInputProps('name')}
              />

              <TextInput
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps('email')}
              />

              <Textarea
                label="Message"
                placeholder="How can I help you?"
                minRows={4}
                {...form.getInputProps('message')}
              />

              <Button 
                type="submit" 
                loading={form.isSubmitting}
                style={{
                  background: 'linear-gradient(45deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-violet-6) 100%)'
                }}
              >
                Send Message
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}
