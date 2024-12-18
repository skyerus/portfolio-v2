'use client'

import { Container, Title, TextInput, Textarea, Button, Paper, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
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

  const handleSubmit = (values: ContactFormValues) => {
    // TODO: Implement form submission
    console.log(values);
  };

  return (
    <Container size="sm" py="xl">
        <Paper shadow="md" radius="lg" p="xl" className={classes.form}>
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

                <Button type="submit" fullWidth>
                  Send Message
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
    </Container>
  );
}
