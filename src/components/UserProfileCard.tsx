import type { TrelloUser } from '@/types/trello';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle2 } from 'lucide-react';

interface UserProfileCardProps {
  user: TrelloUser;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const fallbackInitials = user.fullName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase() || user.username[0]?.toUpperCase() || 'U';

  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar className="h-16 w-16">
          {user.avatarUrl ? (
             // Trello avatars are often like: https://trello-members.s3.amazonaws.com/{id}/{hash}/50.png -> /170.png for larger
            <AvatarImage src={`${user.avatarUrl}/170.png`} alt={user.fullName} />
          ) : null }
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
            {user.avatarUrl ? fallbackInitials : <UserCircle2 size={32} />}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl font-headline">{user.fullName}</CardTitle>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </CardHeader>
    </Card>
  );
}
