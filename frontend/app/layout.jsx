import './globals.css';
import { Inter, Fira_Code } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
});

export const metadata = {
  title: 'AI Content Generator - Chat ONN',
  description: 'Generate amazing content with AI-powered chat interface',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
      </head>
      <body className={`${inter.variable} ${firaCode.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
