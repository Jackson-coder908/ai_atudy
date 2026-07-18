import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Brain, Layers, Cpu } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    {
      name: 'Flashcards',
      path: '/flashcards',
      icon: Layers
    },
    {
      name: 'AI Research Assistant',
      path: '/assistant',
      icon: Cpu
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface-container-lowest border-r border-outline-variant w-sidebar-width py-xl px-md">
      {/* Brand Logo Area */}
      <Link to="/" onClick={onClose} className="flex items-center gap-sm px-md mb-xl cursor-pointer">
        <Brain className="w-7 h-7 text-primary fill-primary/10" />
        <span className="text-headline-md font-bold text-primary">ResearchNode</span>
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-sm">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-md px-md py-sm rounded-lg transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary rounded-l-none'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              <Icon className="w-5 h-5 stroke-[2px]" />
              <span className="text-label-md">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Version Metadata at Bottom */}
      <div className="mt-auto pt-md border-t border-outline-variant/50 px-md text-center">
        <p className="text-label-sm text-outline">v1.2.0 • Pro Plan</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 z-40 w-sidebar-width">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-inverse-surface/30 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer Body */}
          <aside className="relative z-50 h-full animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
