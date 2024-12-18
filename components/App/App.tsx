"use client"

import { AppShell } from '@mantine/core';
import classes from './App.module.css';

export function App({ children }: { children: React.ReactNode }) {
  return (
    <AppShell className={classes.appShell}>
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}