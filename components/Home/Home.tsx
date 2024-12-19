import { Text, Title, Stack, Group, Image, Paper, Container } from '@mantine/core';
import classes from './Home.module.css';
import { Skills } from '../Skills/Skills';
import { SocialIcons } from './SocialIcons';

export function Home() {
  return (
    <div className={classes.home}>
      <Container size="xs" py="xl">
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
                <SocialIcons />
              </Title>
            </Group>

            <Text c="gray.0" ta="center" size="lg" maw={580}>
              Based in London, I craft automated systems to empower people.
            </Text>
          </Stack>
        </Paper>
      </Container>
      <Skills />
    </div>
  );
}
