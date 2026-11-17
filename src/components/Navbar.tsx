import React from 'react';
import { Gift } from 'lucide-react';

export type NavDestination = 'home' | 'surprise' | 'message';

interface NavbarProps {
  activeSection: NavDestination;
  onNavigate: (destination: NavDestination) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const links: Array<{ id: NavDestination; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'surprise', label: 'Surprise' },
    { id: 'message', label: 'Message' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-[#10091F]/75 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 h-14">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-left text-white hover:opacity-90 transition-opacity min-h-[44px] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4FCB] rounded-lg px-1"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#FF4FCB]/20 border border-[#FFB6E6]/35 text-[#FFD780]">
            <Gift className="w-4 h-4" aria-hidden="true" />
          </span>
          <span className="text-sm sm:text-base font-medium tracking-tight text-white">
            A Little Surprise <span aria-hidden="true">💗</span>
          </span>
        </button>

        <nav aria-label="Primary navigation" className="flex items-center gap-2 sm:gap-6">
          {links.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate(link.id)}
                className={`relative min-h-[44px] px-2.5 sm:px-3 flex items-center text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4FCB] ${
                  isActive
                    ? 'text-[#FFB6E6]'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-2 left-2.5 right-2.5 h-0.5 rounded-full bg-gradient-to-r from-[#FF4FCB] to-[#FFD780] shadow-[0_0_8px_rgba(255,79,203,0.85)]"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
