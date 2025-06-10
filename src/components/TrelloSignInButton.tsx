'use client';

import { Button } from '@/components/ui/button';
import { Trello } from 'lucide-react';
import Link from 'next/link';

export function TrelloSignInButton() {
  return (
    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
      <Link href="/api/auth/trello">
        <Trello className="mr-2 h-5 w-5" />
        Sign in with Trello
      </Link>
    </Button>
  );
}
