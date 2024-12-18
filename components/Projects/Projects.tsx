'use client'

import { Title, Text, Card, Button, Stack, Group, Container, Image, Box } from '@mantine/core';
import { IconExternalLink, IconCancel } from '@tabler/icons-react';
import classes from './Projects.module.css';

interface ProjectCardContentProps {
  title: string;
  description: string;
  technologies: Array<{
    icon: string;
    name: string;
  }>;
  date: string;
  liveUrl?: string;
  isDiscontinued?: boolean;
}

function ProjectCardContent({ title, description, technologies, date, liveUrl, isDiscontinued }: ProjectCardContentProps) {
  const openInNewTab = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    window.open(url);
  };

  return (
    <Stack id="projects" gap="sm">
      <Title order={3}>
        {title}
        <Text size="xs" c="dimmed">
          {date}
        </Text>
      </Title>

      

      <Group gap="md">
        {technologies.map((tech, index) => (
          <Group key={index} gap={4}>
            <Image
              src={tech.icon}
              h={20}
              w={20}
              alt={tech.name}
            />
            <Text size="xs" fw={600} c="dimmed">
              {tech.name}
            </Text>
          </Group>
        ))}
      </Group>

      <Text size="sm" c="dimmed">
        {description}
      </Text>

      {isDiscontinued ? (
        <Button
          variant="outline"
          leftSection={<IconCancel size={16} />}
          disabled
        >
          DISCONTINUED
        </Button>
      ) : liveUrl && (
        <Button
          variant="outline"
          leftSection={<IconExternalLink size={16} />}
          onClick={(e) => openInNewTab(e, liveUrl)}
          component="a"
          href={liveUrl}
        >
          LIVE
        </Button>
      )}
    </Stack>
  );
}

export function Projects() {
  const riptidesContent = {
    title: 'riptides.io',
    date: '2019',
    description: 'riptides is a chat service with a music queue (via Spotify) that each participant can add to. Created from a desire to listen/share music with friends.',
    technologies: [
      { icon: '/icons/go-original.svg', name: 'GOLANG' },
      { icon: '/icons/vuejs-original.svg', name: 'VUEJS' },
      { icon: '/icons/mysql-original.svg', name: 'MYSQL' },
      { icon: '/icons/redis-original.svg', name: 'REDIS' },
    ],
    isDiscontinued: true
  };

  const dateguessContent = {
    title: 'dateguess.skyegill.com',
    date: '2020',
    description: 'Inspired by geoguesser, this is a game of date guessing.',
    technologies: [
      { icon: '/icons/go-original.svg', name: 'GOLANG' },
      { icon: '/icons/react-original.svg', name: 'REACT' },
      { icon: '/icons/mysql-original.svg', name: 'MYSQL' },
    ],
    liveUrl: 'https://dateguess.skyegill.com'
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Title
          className={classes.title}
          order={2}
        >
          Projects
        </Title>

        <Stack gap="xl">
          <Card shadow="md" radius="md" className={classes.projectCard} p={0}>
            <Box pos="relative">
              <Image
                src="/dateguess.com.png"
                alt="dateguess.com screenshot"
                className={classes.projectImage}
              />
              <Card 
                shadow="md" 
                className={classes.infoCard}
                display={{ base: 'none', md: 'block' }}
                p="md"
              >
                <ProjectCardContent {...dateguessContent} />
              </Card>
            </Box>
            <Box p={{ base: 'md', md: 0 }} display={{ md: 'none' }}>
              <ProjectCardContent {...dateguessContent} />
            </Box>
          </Card>
          <Card shadow="md" radius="md" className={classes.projectCard} p={0}>
            <Box pos="relative">
              <video autoPlay loop muted className={classes.video}>
                <source src="/riptides.mp4" />
              </video>
              <Card 
                shadow="md" 
                className={classes.infoCard}
                display={{ base: 'none', md: 'block' }}
                p="md"
              >
                <ProjectCardContent {...riptidesContent} />
              </Card>
            </Box>
            <Box p={{ base: 'md', md: 0 }} display={{ md: 'none' }}>
              <ProjectCardContent {...riptidesContent} />
            </Box>
          </Card>
        </Stack>
      </Stack>
    </Container>
  );
}
