import React, { useState } from 'react';
import { Play, Search, X, Heart, Menu } from 'lucide-react';
import { NavTab } from '../types';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  favoritesCount: number;
  onOpenHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  favoritesCount,
  onOpenHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: NavTab; badge?: number }[] = [
    { label: 'Trending' },
    { label: 'Movies' },
    { label: 'TV Series' },
    { label: 'Favorites', badge: favoritesCount },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#030d1d]/90 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            id="brand-logo-btn"
            onClick={onOpenHome}
            className="group flex items-center gap-2.5 focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#f6c700] flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Play className="w-5 h-5 text-slate-950 fill-slate-950 ml-0.5" />
            </div>
            <span className="font-extrabold text-2xl tracking-wider text-white font-['Bebas_Neue',sans-serif] text-[28px] leading-none pt-1">
              FYPFLIX
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activeTab === item.label;
              return (
                <button
                  key={item.label}
                  id={`nav-link-${item.label.toLowerCase().replace(' ', '-')}`}
                  onClick={() => {
                    onSelectTab(item.label);
                  }}
                  className={`text-sm font-semibold tracking-wide transition-colors relative py-1 cursor-pointer flex items-center gap-1.5 ${
                    isActive ? 'text-[#f6c700]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[10px] bg-[#f6c700] text-black font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f6c700] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Search Input & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-72 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search movies, series..."
              className="w-full bg-[#0d1e38] text-sm text-slate-100 placeholder-slate-400 pl-10 pr-9 py-2 rounded-full border border-white/10 focus:outline-none focus:border-[#f6c700] focus:ring-1 focus:ring-[#f6c700] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-white/5 border border-white/10"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#05142b] border-b border-white/10 px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onSelectTab(item.label);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-between ${
                activeTab === item.label
                  ? 'bg-[#f6c700] text-slate-950 font-bold'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
