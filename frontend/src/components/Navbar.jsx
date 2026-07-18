import React, { useState, useRef, useEffect } from 'react';
import { Menu, ChevronDown, User, LogOut } from 'lucide-react';

export default function Navbar({ onMenuToggle }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    alert('Mock Logout triggered. Session cleared.');
  };

  const handleProfile = () => {
    setDropdownOpen(false);
    alert('Mock Profile page navigation.');
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-sidebar-width h-16 border-b border-outline-variant bg-surface px-lg flex items-center justify-between z-30 shadow-[0_0_0_0_transparent]">
      {/* Mobile Hamburger menu */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden text-secondary p-2 -ml-2 rounded-full hover:bg-surface-container-low transition-colors"
      >
        <Menu className="w-6 h-6 stroke-[2px]" />
      </button>

      {/* Spacer to align profile on right */}
      <div className="hidden lg:block flex-1" />

      {/* User profile dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 cursor-pointer hover:bg-surface-container-low p-2 rounded-lg transition-colors select-none"
        >
          <img
            className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0]"
            alt="Alex Rivera headshot"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL49SV1NF_abHf-6Xoiel_SGaqvWQWWdiUpNw5sEU2R5KjxPSXjaTabl01YRgxHN4bGv17iKq1eIRUY20tKaHv26sbTZ4z5as5urtBonMmOAKx-KInivm24M_AywTbEMFJOeraJTiVJ5B1Gnd1BXzye2KVTZ2XhJFcXuD4uCQTdJi_iZSEq2UYky1XLPNBkgPltn14UZpuspTl0DAgpwoQXv91yaILhaz1fp40EBUAeCIDV29GgLc2PnTgaZ4ew5h4k5Geau7Gj7Y"
          />
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-label-md font-medium text-on-surface">Alex Rivera</span>
            <ChevronDown className={`w-4 h-4 text-secondary transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <button
              onClick={handleProfile}
              className="w-full flex items-center gap-2 px-4 py-2 text-left text-body-sm text-on-surface hover:bg-surface-container transition-colors"
            >
              <User className="w-4 h-4 text-secondary" />
              <span>Profile Settings</span>
            </button>
            <hr className="border-outline-variant/50 my-1" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-left text-body-sm text-error hover:bg-error-container/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
