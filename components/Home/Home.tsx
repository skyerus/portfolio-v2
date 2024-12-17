import { Text, Title, Stack, Group, Image } from '@mantine/core';
import classes from './Home.module.css';

export function Home() {
  return (
    <Stack className={classes.container} justify="center" align="center">
      <Group align="center" gap={40} justify="center">
        <Image
          src="/profile.jpg"
          className={classes.avatar}
          alt="Skye Gill"
        />
        <Title className={classes.title} ta={{ base: 'center', sm: 'left' }}>
          <Text inherit gradient={{ from: 'blue', to: 'violet' }} variant='gradient' component="span" >
            Skye Gill
        </Text>
          <Text className={classes.subtitle} size="xl" fw={400} ta={{ base: 'center', sm: 'left' }}>
            Software Engineer
          </Text>
        </Title>
      </Group>

      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt={40}>
        Based in London, I craft efficient and elegant solutions with a focus on simplicity.
      </Text>
    </Stack>
  );
}
