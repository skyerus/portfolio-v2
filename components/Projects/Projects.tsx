'use client'

import { Title, Text, Card, Button, Stack, Group, Container, Image, Box } from '@mantine/core';
import { IconExternalLink, IconCancel } from '@tabler/icons-react';
import classes from './Projects.module.css';

interface Technology {
  icon: string;
  name: string;
  className?: string;
}

interface Project {
  title: string;
  description: string;
  technologies: Technology[];
  date: string;
  liveUrl?: string;
  isDiscontinued?: boolean;
  media: {
    type: 'image' | 'video';
    src: string;
    alt?: string;
  };
}

// Move ProjectCardContent props to use the Project interface
function ProjectCardContent(props: Project) {
  const openInNewTab = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    window.open(url);
  };

  return (
    <Stack id="projects" gap="sm">
      <Title order={3} className={classes.projectText}>
        {props.title}
        <Text size="xs" className={classes.dimmedText}>
          {props.date}
        </Text>
      </Title>

      <Group gap="md">
        {props.technologies.map((tech, index) => (
          <Group key={index} gap={4}>
            <Image src={tech.icon} h={20} w={20} alt={tech.name} className={tech.className} />
            <Text size="xs" fw={600} className={classes.dimmedText}>
              {tech.name}
            </Text>
          </Group>
        ))}
      </Group>

      <Text size="sm" className={classes.dimmedText}>
        {props.description}
      </Text>

      {props.isDiscontinued ? (
        <Button variant="outline" leftSection={<IconCancel size={16} />} disabled>
          DISCONTINUED
        </Button>
      ) : props.liveUrl && (
        <Button
          variant="outline"
          leftSection={<IconExternalLink size={16} />}
          onClick={(e) => openInNewTab(e, props.liveUrl!)}
          component="a"
          href={props.liveUrl}
        >
          LIVE
        </Button>
      )}
    </Stack>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card shadow="md" radius="md" className={classes.projectCard} p={0}>
      <Box pos="relative">
        {project.media.type === 'video' ? (
          <video autoPlay loop muted className={classes.video}>
            <source src={project.media.src} />
          </video>
        ) : (
          <Image
            src={project.media.src}
            alt={project.media.alt || `${project.title} screenshot`}
            className={classes.projectImage}
          />
        )}
        <Card
          shadow="md"
          className={classes.infoCard}
          display={{ base: 'none', md: 'block' }}
          p="md"
        >
          <ProjectCardContent {...project} />
        </Card>
      </Box>
      <Box p={{ base: 'md', md: 0 }} display={{ md: 'none' }}>
        <ProjectCardContent {...project} />
      </Box>
    </Card>
  );
}

export function Projects() {
  const projects: Project[] = [
    {
      title: 'websemble.com',
      date: '2025',
      description: 'A web agency.',
      technologies: [
        { 
          icon: '/icons/nextjs-line.svg', 
          name: 'NEXTJS',
          className: classes.invertedIcon
        },
      ],
      media: {
        type: 'image',
        src: '/websemble.png',
        alt: 'websemble.com screenshot'
      },
      liveUrl: 'https://websemble.com'
    },
    {
      title: 'dateguess.skyegill.com',
      date: '2020',
      description: 'Inspired by geoguesser, this is a game of date guessing.',
      technologies: [
        { icon: '/icons/go-original.svg', name: 'GOLANG' },
        { icon: '/icons/react-original.svg', name: 'REACT' },
        { icon: '/icons/mysql-original.svg', name: 'MYSQL' },
      ],
      isDiscontinued: true,
      media: {
        type: 'image',
        src: '/dateguess.com.png',
        alt: 'dateguess.com screenshot'
      }
    },
    {
      title: 'riptides.io',
      date: '2019',
      description: 'riptides is a chat service with a music queue (via Spotify) that each participant can add to. Created from a desire to listen/share music with friends.',
      technologies: [
        { icon: '/icons/go-original.svg', name: 'GOLANG' },
        { icon: '/icons/vuejs-original.svg', name: 'VUEJS' },
        { icon: '/icons/mysql-original.svg', name: 'MYSQL' },
        { icon: '/icons/redis-original.svg', name: 'REDIS' },
      ],
      isDiscontinued: true,
      media: {
        type: 'video',
        src: '/riptides.mp4'
      }
    }
  ];

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </Stack>
    </Container>
  );
}
