import { Text, Title, Stack, Group, Image, Paper, Container } from '@mantine/core';
import classes from './Contact.module.css';

export function Contact() {
  return (
    <Container id="contact" pt={100} size="xs" py="xl">
      <Paper 
        shadow="md" 
        radius="lg" 
        p="xl"
        bg="inherit"
        w="fit-content"
        mx="auto"
      >
        <Stack gap="lg" align="center">
          <Group align="center" gap={40} justify="center">
            <Image
              src="/profile.jpg"
              className={classes.avatar}
              alt="Skye Gill"
            />
            <Title className={classes.title} ta={{ base: 'center', sm: 'left' }}>
              <Text inherit gradient={{ from: 'blue', to: 'violet' }} variant='gradient' component="span">
                Skye Gill
              </Text>
              <Text className={classes.subtitle} size="xl" fw={400} ta={{ base: 'center', sm: 'left' }}>
                Software Engineer
              </Text>
            </Title>
          </Group>

          <Text c="gray.0" ta="center" size="lg" maw={580}>
            Based in London, I craft automated systems in the pursuit of empowering people.
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
