import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <meta name="theme-color" content="#1976d2" />
          <meta name="description" content="Fixed Wireless Performance Manager - Track and monitor network performance, devices, and implementations" />
          
          {/* Script to handle initial theme class to avoid flashing */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    // Check for saved theme preference
                    var savedTheme = localStorage.getItem('theme');
                    
                    // Check if user prefers dark mode
                    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                    
                    // Determine theme: Saved preference takes priority over system preference
                    var theme = savedTheme || (prefersDark ? 'dark' : 'light');
                    
                    // Apply theme class to HTML element
                    document.documentElement.classList.remove('light', 'dark');
                    document.documentElement.classList.add(theme);
                    
                    // Set initial theme color meta tag
                    var metaThemeColor = document.querySelector('meta[name=theme-color]');
                    if (metaThemeColor) {
                      metaThemeColor.content = theme === 'dark' ? '#111827' : '#1976d2';
                    }
                  } catch (e) {
                    // Fallback to light theme if there's an error
                    document.documentElement.classList.add('light');
                    console.error('Error initializing theme:', e);
                  }
                })();
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
} 