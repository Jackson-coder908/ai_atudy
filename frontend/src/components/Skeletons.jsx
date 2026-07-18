import React from 'react';

// Flashcard skeleton loader
export function CardSkeleton() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-[16px] p-lg animate-pulse flex flex-col h-[200px] justify-between shadow-sm">
      <div className="space-y-sm">
        {/* Category tag */}
        <div className="h-6 w-24 bg-surface-container-high rounded" />
        {/* Title */}
        <div className="h-7 w-3/4 bg-surface-container-highest rounded mt-md" />
        {/* Description line 1 */}
        <div className="h-4 w-full bg-surface-container-high rounded mt-sm" />
        {/* Description line 2 */}
        <div className="h-4 w-5/6 bg-surface-container-high rounded" />
      </div>
      {/* Footer info */}
      <div className="flex items-center justify-between border-t border-outline-variant/30 pt-md mt-auto">
        <div className="h-4 w-16 bg-surface-container-high rounded" />
        <div className="h-4 w-20 bg-surface-container-high rounded" />
      </div>
    </div>
  );
}

// Chat bubble skeleton loader
export function ChatSkeleton() {
  return (
    <div className="flex justify-start gap-4 w-full animate-pulse">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-surface-container-high flex-shrink-0 border border-outline-variant/60" />
      
      {/* Bubble */}
      <div className="flex-1 max-w-[70%] bg-surface-container-low border border-outline-variant/30 rounded-2xl rounded-tl-sm p-lg space-y-sm shadow-sm">
        <div className="h-4 w-full bg-surface-container-high rounded" />
        <div className="h-4 w-5/6 bg-surface-container-high rounded" />
        <div className="h-4 w-2/3 bg-surface-container-high rounded" />
      </div>
    </div>
  );
}

// Sidebar list item skeleton loader
export function ListSkeleton() {
  return (
    <div className="animate-pulse space-y-sm">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex justify-between items-center p-2 rounded bg-surface-container-low/50">
          <div className="overflow-hidden space-y-2 flex-1">
            <div className="h-4 w-2/3 bg-surface-container-high rounded" />
            <div className="h-3 w-1/3 bg-surface-container-high rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
