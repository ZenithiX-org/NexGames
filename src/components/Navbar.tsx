import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Gamepad2, 
  Compass, 
  Info, 
  Upload, 
  Search, 
  Palette, 
  Check, 
  User, 
  LogOut,
  Flame,
  ChevronDown
} from 'lucide-react';
import { GRADIENT_PRESETS, GradientPreset } from './ShaderBackground';

interface NavbarProps {
  activeTab: 'home' | 'games' | 'about' | 'play' | 'studio';
  setActiveTab: (tab: 'home' | 'games' | 'about' | 'play' | 'studio') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentPresetId?: string;
  setCurrentPresetId?: (id: string) => void;
  shaderPreset?: string;
  setShaderPreset?: (id: string) => void;
  myProfile: {
    username: string;
    avatar: string;
    isSignedIn: boolean;
    email?: string;
  };
  onOpenAuth?: () => void;
  onSignInClick?: () => void;
  onProfileClick?: () => void;
  onSignOut?: () => void;
  onSignOutClick?: () => void;
  gamesCount?: number;
}

interface NavTabItem {
  id: 'home' | 'games' | 'about' | 'studio';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  currentPresetId,
  setCurrentPresetId,
  shaderPreset,
  setShaderPreset,
  myProfile,
  onOpenAuth,
  onSignInClick,
  onProfileClick,
  onSignOut,
  onSignOutClick,
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const activePresetId = shaderPreset || currentPresetId || 'cyber-aurora';
  const handleSelectPreset = (id: string) => {
    if (setShaderPreset) setShaderPreset(id);
    if (setCurrentPresetId) setCurrentPresetId(id);
  };

  const handleAuthClick = () => {
    if (onSignInClick) onSignInClick();
    else if (onOpenAuth) onOpenAuth();
  };

  const handleProfileClick = () => {
    if (onProfileClick) onProfileClick();
    else if (onOpenAuth) onOpenAuth();
  };

  const handleSignOutClick = () => {
    if (onSignOutClick) onSignOutClick();
    else if (onSignOut) onSignOut();
  };

  const tabs: NavTabItem[] = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'about', label: 'About', icon: Info },
    { id: 'studio', label: 'Studio', icon: Upload, highlight: true },
  ];

  const currentPreset = GRADIENT_PRESETS.find(p => p.id === activePresetId) || GRADIENT_PRESETS[0];

  return (
    <header className="sticky top-3 z-50 px-4 max-w-7xl mx-auto w-full transition-all">
      <nav className="relative flex items-center justify-between px-3 md:px-5 py-2.5 rounded-2xl bg-zinc-950/75 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        
        {/* Brand Logo with 21st.dev Glowing Identity */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-lime-500 p-[1px] shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all">
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Nexus
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v2.5
              </span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400 tracking-wider uppercase hidden sm:block">
              Interactive Web Hub
            </span>
          </div>
        </div>

        {/* 21st.dev Segmented Pill Navigation */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-zinc-900/60 rounded-xl border border-white/[0.06] backdrop-blur-md">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-2 select-none ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className={`absolute inset-0 rounded-lg ${
                      tab.highlight 
                        ? 'bg-gradient-to-r from-orange-500/80 to-amber-500/80 shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                        : 'bg-white/[0.1] border border-white/[0.12] shadow-[0_2px_10px_rgba(0,0,0,0.3)]'
                    }`}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive && tab.highlight ? 'text-white' : ''}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action Bar: Search, Shader Theme Switcher & User Profile */}
        <div className="flex items-center gap-2">
          
          {/* Quick Search Bar */}
          <div className="relative hidden lg:block w-48 xl:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/60 border border-white/[0.08] focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/30 rounded-xl pl-8 pr-8 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Shader Gradient Preset Switcher (21st.dev Interactive Component) */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/60 border border-white/[0.08] hover:border-white/20 text-zinc-300 hover:text-white text-xs font-medium transition-all"
              title="Change Shader Gradient Atmosphere"
            >
              <div 
                className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${currentPreset.color2}, ${currentPreset.color3})`
                }}
              />
              <span className="hidden xl:inline text-[11px] text-zinc-300">{currentPreset.name}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            <AnimatePresence>
              {showThemeMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowThemeMenu(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 p-2 rounded-xl bg-zinc-950/90 backdrop-blur-2xl border border-white/10 shadow-2xl z-50 flex flex-col gap-1"
                  >
                    <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Palette className="w-3 h-3 text-emerald-400" />
                      Shader Background
                    </div>
                    {GRADIENT_PRESETS.map((preset) => {
                      const isSelected = preset.id === activePresetId;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => {
                            handleSelectPreset(preset.id);
                            setShowThemeMenu(false);
                          }}
                          className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                            isSelected 
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' 
                              : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div 
                              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow"
                              style={{
                                background: `linear-gradient(135deg, ${preset.color2}, ${preset.color3})`
                              }}
                            />
                            <span>{preset.name}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile / Authentication Badge */}
          {!myProfile.isSignedIn ? (
            <button
              onClick={handleAuthClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-zinc-950 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pr-2.5 rounded-xl bg-zinc-900/70 border border-white/[0.08] hover:border-white/20 transition-all"
              >
                <div className="relative">
                  <img
                    src={myProfile.avatar}
                    alt={myProfile.username}
                    className="w-6 h-6 rounded-lg bg-zinc-800 object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
                </div>
                <span className="text-xs font-semibold text-zinc-200 max-w-[90px] truncate">
                  {myProfile.username}
                </span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowProfileMenu(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 p-2 rounded-xl bg-zinc-950/90 backdrop-blur-2xl border border-white/10 shadow-2xl z-50 flex flex-col gap-1"
                    >
                      <div className="px-2.5 py-1.5 border-b border-white/[0.06] mb-1">
                        <div className="text-xs font-bold text-white">@{myProfile.username}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">Active Operator</div>
                      </div>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleProfileClick();
                        }}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 hover:bg-white/[0.06] hover:text-white transition-all text-left"
                      >
                        <User className="w-3.5 h-3.5" />
                        Edit Profile Handle
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleSignOutClick();
                        }}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-all text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>

      </nav>

      {/* Mobile Navigation Bar Bar (compact bottom or inline) */}
      <div className="md:hidden flex items-center justify-around mt-2 p-1.5 rounded-xl bg-zinc-950/80 backdrop-blur-xl border border-white/[0.08]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-emerald-400' : 'text-zinc-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
