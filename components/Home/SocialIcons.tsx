import { Group, ActionIcon } from '@mantine/core';
import { IconBrandGithub, IconBrandTwitter, IconBrandLinkedin } from '@tabler/icons-react';

const Icons = () => (
  <>
    <ActionIcon
      variant="subtle"
      size="lg"
      color="gray.0"
      component="a"
      href="https://github.com/skyerus"
      target="_blank"
    >
      <IconBrandGithub style={{ width: '70%', height: '70%' }} stroke={1.5} />
    </ActionIcon>
    <ActionIcon
      variant="subtle"
      size="lg"
      color="gray.0"
      component="a"
      href="https://twitter.com/skyegill95"
      target="_blank"
    >
      <IconBrandTwitter style={{ width: '70%', height: '70%' }} stroke={1.5} />
    </ActionIcon>
    <ActionIcon
      variant="subtle"
      size="lg"
      color="gray.0"
      component="a"
      href="https://www.linkedin.com/in/skye-gill"
      target="_blank"
    >
      <IconBrandLinkedin style={{ width: '70%', height: '70%' }} stroke={1.5} />
    </ActionIcon>
  </>
);

export function SocialIcons() {
  return (
    <>
      <Group gap={5} mt={4} justify="center" display={{ base: 'flex', sm: 'none' }}>
        <Icons />
      </Group>
      <Group gap={5} mt={4} justify="flex-start" display={{ base: 'none', sm: 'flex' }}>
        <Icons />
      </Group>
    </>
  );
} 