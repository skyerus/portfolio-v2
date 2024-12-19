"use client"

import { AppShell, Group, Button, Container } from '@mantine/core';
import { useEffect, useState, useRef } from 'react';
import classes from './App.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Chat } from '../Chat/Chat';

export function App({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState(0);
  const sections = ['home', 'projects', 'contact'];
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Initialize refs
    sections.forEach((_, index) => {
      const element = document.getElementById(sections[index]);
      sectionRefs.current[index] = element;
    });

    const handleScroll = () => {
      // Only track scroll on home page
      if (pathname !== '/') return;

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
  }, [sections, pathname]);

  const NavButtons = () => (
    <>
      <Button
        variant="subtle"
        className={pathname === '/' && activeSection === 0 ? classes.activeNav : ''}
        c="gray.0"
        size="compact-sm"
        px="xs"
        component={Link}
        href="/"
      >
        Home
      </Button>
      <Button
        variant="subtle"
        className={pathname === '/' && activeSection === 1 ? classes.activeNav : ''}
        c="gray.0"
        size="compact-sm"
        px="xs"
        component={Link}
        href="/#projects"
      >
        Projects
      </Button>
      <Button
        variant="subtle"
        className={pathname === '/' && activeSection === 2 ? classes.activeNav : ''}
        c="gray.0"
        size="compact-sm"
        px="xs"
        component={Link}
        href="/#contact"
      >
        Contact
      </Button>
      <Button
        variant="subtle"
        component={Link}
        href="/blog"
        c="gray.0"
        size="compact-sm"
        px="xs"
        className={pathname.startsWith('/blog') ? classes.activeNav : ''}
      >
        Blog
      </Button>
    </>
  );

  return (
    <AppShell
      header={{ height: 40 }}
      className={classes.appShell}
    >
      <AppShell.Header className={classes.header}>
        <Container size="md" h="100%">
          {/* Mobile Navigation */}
          <Group justify="space-around" h="100%" display={{ base: 'flex', sm: 'none' }}>
            <NavButtons />
          </Group>

          {/* Desktop Navigation */}
          <Group justify="flex-end" h="100%" gap="md" display={{ base: 'none', sm: 'flex' }}>
            <NavButtons />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
          {children}
          <Chat/>
      </AppShell.Main>
    </AppShell>
  );
}