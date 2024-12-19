'use client'

import { Stack, Image, Text, Box, Container } from '@mantine/core';
import classes from './Skills.module.css';

interface IconProps {
  src: string;
  name: string;
  inverted?: boolean;
}

function Icon({ src, name, inverted }: IconProps) {
  return (
    <Stack gap="xs" align="center" className={classes.iconContainer}>
      <Image
        src={src}
        alt={name}
        w={50}
        h={50}
        className={inverted ? classes.invertedIcon : undefined}
      />
      <Text size="sm" c="dimmed">
        {name}
      </Text>
    </Stack>
  );
}

export function Skills() {
  const skills = [
    { src: "/icons/go-original.svg", name: "Go" },
    { src: "/icons/javascript-plain.svg", name: "Javascript" },
    { src: "/icons/elixir-original.svg", name: "Elixir" },
    { src: "/icons/python-original.svg", name: "Python" },
    { src: "/icons/php-plain.svg", name: "PHP" },
    { src: "/icons/mysql-original.svg", name: "MySQL" },
    { src: "/icons/react-original.svg", name: "React" },
    { src: "/icons/nextjs-line.svg", name: "NextJS", inverted: true },
    { src: "/icons/docker-plain.svg", name: "Docker" },
    { src: "/icons/kubernetes-plain.svg", name: "Kubernetes" },
  ];

  return (
    <Container maw={{ base: '100%', md: '45%' }}>
      <Box className={classes.scrollContainer}>
        <Box className={classes.marquee}>
          {skills.map((skill, index) => (
            <Box key={index} className={classes.scrollItem}>
              <Icon {...skill} />
            </Box>
          ))}
        </Box>

        <Box className={classes.marquee2}>
          {skills.map((skill, index) => (
            <Box key={`clone-${index}`} className={classes.scrollItem}>
              <Icon {...skill} />
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
