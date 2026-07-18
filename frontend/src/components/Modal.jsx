import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with 20% blur (glassmorphism) */}
      <div 
        className="fixed inset-0 bg-[#302f39]/20 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="bg-surface-container-lowest border border-outline rounded-xl max-w-lg w-full shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant/50">
          <h2 className="text-headline-sm font-bold text-on-surface">{title}</h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full p-1.5 transition-colors"
          >
            <X className="w-5 h-5 stroke-[2px]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
