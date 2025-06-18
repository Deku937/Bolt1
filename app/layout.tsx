import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import { LanguageProvider } from '@/providers/language-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from '@/components/ui/sonner';
import { Chatbot } from '@/components/chatbot/chatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MindWell - Mental Health Support Platform',
  description: 'Connect with licensed mental health professionals and access personalized support for your mental well-being journey.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              {children}
              <Toaster />
              <Chatbot />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}