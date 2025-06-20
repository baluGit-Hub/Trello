import type { TrelloBoard, TrelloList } from '@/types/trello';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KanbanSquare, Columns, RectangleHorizontal, ExternalLink, CalendarDays, Tag } from 'lucide-react';
import Image from 'next/image';

interface BoardDisplayProps {
  board: TrelloBoard;
  listsWithCards: TrelloList[];
}

function getContrastYIQ(hexcolor: string | null | undefined){
  if (!hexcolor) return 'black';
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0,2),16);
  const g = parseInt(hexcolor.substr(2,2),16);
  const b = parseInt(hexcolor.substr(4,2),16);
  const yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? 'black' : 'white';
}

export function BoardDisplay({ board, listsWithCards }: BoardDisplayProps) {
  const boardBgStyle: React.CSSProperties = {};
  if (board.prefs?.backgroundImage) {
    boardBgStyle.backgroundImage = `url(${board.prefs.backgroundImage})`;
    boardBgStyle.backgroundSize = 'cover';
    boardBgStyle.backgroundPosition = 'center';
  } else if (board.prefs?.backgroundColor) {
    boardBgStyle.backgroundColor = board.prefs.backgroundColor;
  } else {
    boardBgStyle.backgroundColor = 'hsl(var(--muted))'; // Default if no prefs
  }
  const textColor = getContrastYIQ(board.prefs?.backgroundColor);


  return (
    <AccordionItem value={board.id} className="mb-4 border-none">
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <AccordionTrigger 
          className="p-0 hover:no-underline focus:no-underline"
          style={boardBgStyle}
        >
          <div className={`flex items-center justify-between w-full p-4 ${(board.prefs?.backgroundImage || board.prefs?.backgroundColor) ? 'bg-black/30 backdrop-blur-sm' : ''}`}>
            <div className="flex items-center">
              <KanbanSquare className="mr-3 h-6 w-6 flex-shrink-0" style={{color: 'white'}} />
              <h3 className="text-xl font-semibold font-headline" style={{color: 'white'}}>{board.name}</h3>
            </div>
             {/* Chevron is part of AccordionTrigger */}
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-0">
          <div className="bg-card p-4">
            {board.desc && <p className="text-sm text-muted-foreground mb-4 italic">{board.desc}</p>}
            {listsWithCards.length === 0 ? (
              <p className="text-muted-foreground p-4 text-center">This board has no lists or cards.</p>
            ) : (
              <div className="space-y-4">
                {listsWithCards.map((list) => (
                  <Card key={list.id} className="bg-muted/50">
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-lg flex items-center">
                        <Columns className="mr-2 h-5 w-5 text-primary" />
                        {list.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {list.cards && list.cards.length > 0 ? (
                        <ul className="space-y-2">
                          {list.cards.map((trelloCard) => (
                            <li key={trelloCard.id} className="p-3 bg-card rounded-md shadow-sm border border-border/50 hover:border-primary/50 transition-colors">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium flex items-center">
                                  <RectangleHorizontal className="mr-2 h-4 w-4 text-gray-500" />
                                  {trelloCard.name}
                                </h5>
                                {trelloCard.shortUrl && (
                                  <a href={trelloCard.shortUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    <ExternalLink size={16} />
                                  </a>
                                )}
                              </div>
                              {trelloCard.desc && <p className="text-xs text-muted-foreground mt-1 pl-6">{trelloCard.desc.substring(0,100)}{trelloCard.desc.length > 100 ? '...' : ''}</p>}
                              <div className="mt-2 pl-6 space-y-1">
                                {trelloCard.due && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <CalendarDays size={14} className="mr-1 text-accent" />
                                    Due: {new Date(trelloCard.due).toLocaleDateString()}
                                  </div>
                                )}
                                {trelloCard.labels && trelloCard.labels.length > 0 && (
                                  <div className="flex flex-wrap gap-1 items-center">
                                    <Tag size={14} className="mr-1 text-accent" />
                                    {trelloCard.labels.map(label => (
                                      <Badge 
                                        key={label.id} 
                                        variant="secondary" 
                                        className="text-xs py-0.5 px-1.5"
                                        style={{ backgroundColor: label.color || undefined, color: getContrastYIQ(label.color) }}
                                      >
                                        {label.name || ''}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground pl-7">No cards in this list.</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
