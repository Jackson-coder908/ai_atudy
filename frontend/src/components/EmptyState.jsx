import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = HelpCircle, 
  title = "No items found", 
  description = "Get started by creating a new entry.", 
  actionLabel, 
  onAction 
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-xxl border border-dashed border-outline-variant/60 rounded-xl bg-surface-container-lowest/30 min-h-[300px]">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-md">
        <Icon className="w-8 h-8 stroke-[1.5px]" />
      </div>
      <h3 className="text-headline-sm font-bold text-on-surface mb-xs">{title}</h3>
      <p className="text-body-md text-on-surface-variant max-w-sm mb-lg">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary py-2 px-6 text-label-md font-medium inline-flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
