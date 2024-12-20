import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '../theme';
import { Notifications } from '@mantine/notifications';

export const metadata = {
  title: 'Skye Gill | Software Engineer',
  description: 'London based software engineer specializing in web development, AI, and cloud technologies. View my projects, blog posts, and get in touch.',
  keywords: 'software engineer, web development, AI, cloud technologies, full-stack developer, React, TypeScript, Go',
  authors: [{ name: 'Skye Gill' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skyegill.com',
    siteName: 'Skye Gill',
    title: 'Skye Gill | Software Engineer',
    description: 'London based software engineer specializing in web development, AI, and cloud technologies.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Skye Gill - Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skye Gill | Software Engineer',
    description: 'London based software engineer specializing in web development, AI, and cloud technologies.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://skyegill.com'),
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="canonical" href="https://skyegill.com" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <meta name="theme-color" content="#1A1B1E" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications zIndex={1000} />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
