import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background font-sans text-on-surface">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-sidebar-width">
        {/* Navbar */}
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />

        {/* Main Content Layout Container */}
        <main className="flex-1 flex flex-col min-h-0 pt-16 h-screen overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
