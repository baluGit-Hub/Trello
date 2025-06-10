import { redirect } from 'next/navigation';
import { getTrelloAuthTokens, isAuthenticated } from '@/lib/auth';
import { getTrelloUser, getTrelloBoards, getBoardListsWithCards } from '@/lib/trello-api';
import type { TrelloUser, TrelloBoard, TrelloList } from '@/types/trello';
import { UserProfileCard } from '@/components/UserProfileCard';
import { BoardDisplay } from '@/components/BoardDisplay';
import { LogoutButton } from '@/components/LogoutButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

interface BoardWithListsAndCards extends TrelloBoard {
  listsWithCards: TrelloList[];
}

async function getDashboardData(accessToken: string, accessTokenSecret: string): Promise<{ user: TrelloUser; boardsData: BoardWithListsAndCards[] }> {
  const user = await getTrelloUser({ accessToken, accessTokenSecret });
  const boards = await getTrelloBoards({ accessToken, accessTokenSecret });

  const boardsDataPromises = boards.map(async (board) => {
    const listsWithCards = await getBoardListsWithCards(board.id, { accessToken, accessTokenSecret });
    return { ...board, listsWithCards };
  });

  const boardsData = await Promise.all(boardsDataPromises);
  return { user, boardsData };
}

export default async function DashboardPage() {
  if (!isAuthenticated()) {
    redirect('/');
  }

  const tokens = getTrelloAuthTokens();
  if (!tokens) {
    // This case should ideally be caught by isAuthenticated, but as a safeguard
    redirect('/');
    return null; 
  }

  let user: TrelloUser | null = null;
  let boardsData: BoardWithListsAndCards[] = [];
  let error: string | null = null;

  try {
    const data = await getDashboardData(tokens.accessToken, tokens.accessTokenSecret);
    user = data.user;
    boardsData = data.boardsData;
  } catch (e: any) {
    console.error("Failed to load dashboard data:", e);
    error = e.message || "An unknown error occurred while fetching Trello data.";
    // Optionally, could try to clear tokens if they are invalid
  }
  
  // If user data couldn't be fetched (e.g. token revoked), redirect to logout to clear cookies
  if (!user && !error) { 
    // This might happen if tokens are present but invalid leading to empty user.
    // Or if getDashboardData throws an error that sets `error` but not `user`.
    // Better to redirect to logout to clear bad tokens.
    redirect('/api/auth/logout?error=invalid_token');
    return null;
  }


  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-headline">Trello Explorer Dashboard</h1>
          <LogoutButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Fetching Trello Data</AlertTitle>
            <AlertDescription>{error} Please try logging out and signing in again.</AlertDescription>
          </Alert>
        )}

        {user && <UserProfileCard user={user} />}

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Your Trello Boards</CardTitle>
          </CardHeader>
          <CardContent>
            {boardsData.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {boardsData.map((board) => (
                  <BoardDisplay key={board.id} board={board} listsWithCards={board.listsWithCards} />
                ))}
              </Accordion>
            ) : (
              !error && <p className="text-muted-foreground text-center py-4">You have no Trello boards, or we couldn't fetch them.</p>
            )}
             {boardsData.length === 0 && error && <p className="text-muted-foreground text-center py-4">Could not load boards due to an error.</p>}
          </CardContent>
        </Card>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t mt-auto">
        Trello Explorer &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

// Ensure Trello avatar domain is allowed for next/image
// Add to next.config.js:
// images: {
//   remotePatterns: [
//     {
//       protocol: 'https',
//       hostname: 'trello-members.s3.amazonaws.com',
//     },
//     {
//       protocol: 'https',
//       hostname: 'placehold.co', // Keep existing
//     }
//   ],
// },
