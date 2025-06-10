'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

export function LogoutButton() {
  return (
    <Button variant="outline" asChild>
      <Link href="/api/auth/logout">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Link>
    </Button>
  );
}
