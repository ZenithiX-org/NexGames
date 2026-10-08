import React from 'react';
import { motion } from 'motion/react';
import { SlidersHorizontal, Sparkles, Star, Flame, Clock } from 'lucide-react';

interface CategoryBarProps {
  categories: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  sortOrder: 'newest' | 'highest' | 'most-viewed';
  setSortOrder: (order: 'newest' | 'highest' | 'most-viewed') => void;
  selectedRating: number;
  setSelectedRating: (r: number) => void;
  totalGames: number;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedTag,
  onSelectTag,
  sortOrder,
  setSortOrder,
  selectedRating,
  setSelectedRating,
  totalGames,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-2 rounded-2xl bg-zinc-950/60 backdrop-blur-xl border border-white/[0.08]">
      
      {/* Category Filter Pills (21st.dev Style Smooth Tabs) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
        <button
          onClick={() => onSelectTag(null)}
          className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedTag === null
              ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-bold'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <span>All Games</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedTag === null ? 'bg-zinc-950/20 text-zinc-950' : 'bg-white/10 text-zinc-400'}`}>
            {totalGames}
          </span>
        </button>

        {categories.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => onSelectTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Sorting & Filter Controls */}
      <div className="flex items-center gap-2 px-1 self-end md:self-auto">
        
        {/* Rating Filter */}
        <div className="flex items-center bg-zinc-900/60 border border-white/[0.06] rounded-xl p-0.5">
          {[0, 90, 95].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRating(r)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
                selectedRating === r
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {r === 0 ? 'All' : `${r}%+`}
            </button>
          ))}
        </div>

        {/* Sort Order Selector */}
        <div className="flex items-center bg-zinc-900/60 border border-white/[0.06] rounded-xl p-0.5 text-xs">
          <button
            onClick={() => setSortOrder('newest')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              sortOrder === 'newest' ? 'bg-white/10 text-white font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Sort by newest"
          >
            Newest
          </button>
          <button
            onClick={() => setSortOrder('highest')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              sortOrder === 'highest' ? 'bg-white/10 text-white font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Sort by highest rating"
          >
            Top Rated
          </button>
          <button
            onClick={() => setSortOrder('most-viewed')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              sortOrder === 'most-viewed' ? 'bg-white/10 text-white font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Sort by most players"
          >
            Popular
          </button>
        </div>

      </div>

    </div>
  );
};
