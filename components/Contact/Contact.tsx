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

  const handleSubmit = form.onSubmit(async (values) => {
    const formData = new FormData();
    formData.append('form-name', 'contact');
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch('/_forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      form.reset();
      notifications.show({
        title: 'Success',
        message: 'Message sent successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to send message. Please try again later.',
        color: 'red',
      });
    }
  });

  return (
    <Container>
      <Paper shadow="md" radius="lg" maw={{ base: '100%', md: '100%' }} p={{ base: 0 }} className={classes.form}>
        <Stack gap="lg">
          <Title order={2} ta="center" c="gray.0">
            Get in Touch
          </Title>

          <form onSubmit={handleSubmit} name="contact" method="POST">
            <input type="hidden" name="form-name" value="contact" />
            <Stack gap="md">
              <TextInput
                label="Name"
                name="name"
                placeholder="Your name"
                required
                {...form.getInputProps('name')}
              />

              <TextInput
                label="Email"
                name="email"
                placeholder="your@email.com"
                required
                {...form.getInputProps('email')}
              />

              <Textarea
                label="Message"
                name="message"
                placeholder="How can I help you?"
                minRows={4}
                required
                {...form.getInputProps('message')}
              />

              <Button 
                type="submit" 
                loading={form.submitting}
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
