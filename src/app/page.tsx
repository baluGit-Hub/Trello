import { TrelloSignInButton } from '@/components/TrelloSignInButton';
import { Button } from '@/components/ui/button';
import { isAuthenticated } from '@/lib/auth';
import { Trello } from 'lucide-react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  if (isAuthenticated()) {
    redirect('/dashboard');
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-background to-blue-100">
      <div className="text-center bg-card p-10 rounded-xl shadow-2xl max-w-md w-full">
        <div className="mx-auto mb-6 flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground">
          <Trello size={32} />
        </div>
        <h1 className="text-4xl font-headline font-bold text-primary mb-4">
          Trello Explorer
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Welcome! Connect your Trello account to explore your boards, lists, and cards with ease.
        </p>
        <TrelloSignInButton />
        <p className="text-xs text-muted-foreground mt-8">
          By signing in, you agree to allow Trello Explorer to read your Trello data.
        </p>
      </div>
       <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        Powered by Next.js & Trello API
      </footer>
    </main>
  );
}
