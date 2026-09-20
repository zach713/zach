import React from 'react';
import { Play } from 'lucide-react';
import { NavTab } from '../types';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenHome }) => {
  return (
    <footer className="w-full bg-[#07030d] border-t border-purple-500/10 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-4">
            <button
              onClick={onOpenHome}
              className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </div>
              <span className="font-extrabold text-2xl tracking-wider text-white font-['Bebas_Neue',sans-serif] leading-none pt-0.5">
                REELORA
              </span>
            </button>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Stream movies and series in HD, free. New titles added every day.
            </p>
          </div>

          {/* Browse Col */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-['Plus_Jakarta_Sans',sans-serif]">
              BROWSE
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onSelectTab('Trending')}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Trending
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('Movies')}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Movies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('TV Series')}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  TV Series
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('Favorites')}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Favorites
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Col */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-['Plus_Jakarta_Sans',sans-serif]">
              LEGAL
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Reelora does not host any files on its servers. All media is linked from third-party
              services.
            </p>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Reelora. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">DMCA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
