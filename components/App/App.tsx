"use client"

import { AppShell, Group, Button, Container } from '@mantine/core';
import { useEffect, useState, useRef } from 'react';
import classes from './App.module.css';

export function App({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState(0);
  const sections = ['home', 'projects', 'contact'];
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const scrollToSection = (index: number) => {
    const element = sectionRefs.current[index];
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Initialize refs
    sections.forEach((_, index) => {
      const element = document.getElementById(sections[index]);
      sectionRefs.current[index] = element;
    });

    const handleScroll = () => {
      let height = 0;
      let currentSection = 0;

      for (let i = 0; i < sections.length; i++) {
        const element = sectionRefs.current[i];
        if (element) {
          let breakpoint = height;
          if (i === sections.length - 1) {
            breakpoint += element.clientHeight / 5;
          } else {
            breakpoint += element.clientHeight / 2;
          }

          if (window.scrollY < breakpoint) {
            currentSection = i;
            break;
          }
          height += element.clientHeight;
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <AppShell
      header={{ height: 40 }}
      padding="md"
      className={classes.appShell}
    >
      <AppShell.Header className={classes.header}>
        <Container size="md" h="100%">
          <Group justify="flex-end" h="100%" gap="md">
            <Button
              variant="subtle"
              className={activeSection === 0 ? classes.activeNav : ''}
              onClick={() => scrollToSection(0)}
              c="gray.0"
              size="compact-sm"
              px="xs"
            >
              Home
            </Button>
            <Button
              variant="subtle"
              className={activeSection === 1 ? classes.activeNav : ''}
              onClick={() => scrollToSection(1)}
              c="gray.0"
              size="compact-sm"
              px="xs"
            >
              Projects
            </Button>
            <Button
              variant="subtle"
              className={activeSection === 2 ? classes.activeNav : ''}
              onClick={() => scrollToSection(2)}
              c="gray.0"
              size="compact-sm"
              px="xs"
            >
              Contact
            </Button>
            <Button
              variant="subtle"
              component="a"
              href="/blog"
              c="gray.0"
              size="compact-sm"
              px="xs"
            >
              Blog
            </Button>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}