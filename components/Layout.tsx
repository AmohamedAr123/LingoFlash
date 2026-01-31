import React, { useState } from 'react';
import { Settings, Menu, ArrowLeft, X, Home, Play, Plus, BarChart3, Clock } from 'lucide-react';
import { AppView, Language } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  language: Language;
  onNavigate: (view: AppView) => void;
  onBack: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  language,
  onNavigate,
  onBack,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isFrench = language === Language.French;
  const isHome = currentView === AppView.MainMenu;

  // Theme configuration based on Language
  const themeClasses = {
    bg: isFrench ? 'bg-rose-50' : 'bg-slate-50',
    text: isFrench ? 'text-rose-950' : 'text-slate-900',
    icon: isFrench ? 'text-rose-700' : 'text-slate-700',
    border: isFrench ? 'border-rose-200' : 'border-slate-200',
    menuHover: isFrench ? 'hover:bg-rose-100 text-rose-800' : 'hover:bg-slate-100 text-slate-800',
  };

  const handleMenuClick = (view: AppView) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  const menuItems = [
    { view: AppView.MainMenu, label: 'الرئيسية (Home)', icon: <Home size={20} /> },
    { view: AppView.TrainingSetup, label: 'بدء التدريب (Training)', icon: <Play size={20} /> },
    { view: AppView.AddContent, label: 'إضافة محتوى (Add)', icon: <Plus size={20} /> },
    { view: AppView.Stats, label: 'الإحصائيات (Stats)', icon: <BarChart3 size={20} /> },
    { view: AppView.Unfinished, label: 'التدريبات المعلقة (Saved)', icon: <Clock size={20} /> },
    { view: AppView.Settings, label: 'إعدادات المزامنة (Sync)', icon: <Settings size={20} /> },
  ];

  return (
    <div className={`min-h-screen w-full flex flex-col ${themeClasses.bg} ${themeClasses.text} transition-colors duration-500 relative overflow-hidden`}>
      
      {/* Header */}
      <header className={`p-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md bg-opacity-90 ${themeClasses.bg} shadow-sm border-b ${themeClasses.border}`}>
        
        {/* TOP LEFT: Settings OR Back Button (Strict Swap Rule) */}
        <button
          onClick={() => isHome ? onNavigate(AppView.Settings) : onBack()}
          className={`p-2 rounded-full hover:bg-black/5 transition-colors ${themeClasses.icon}`}
          aria-label={isHome ? "Settings" : "Go Back"}
        >
          {isHome ? <Settings size={24} /> : <ArrowLeft size={24} />}
        </button>

        {/* Title */}
        {!isHome && (
            <h1 className="text-lg font-bold opacity-90 tracking-wide">
                {currentView === AppView.TrainingSetup && "Start Training"}
                {currentView === AppView.AddContent && "Add Content"}
                {currentView === AppView.Stats && "Performance"}
                {currentView === AppView.Unfinished && "Saved Sessions"}
                {currentView === AppView.Settings && "Settings"}
            </h1>
        )}

        {/* TOP RIGHT: Menu Button (Always Available) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-2 rounded-full hover:bg-black/5 transition-colors ${themeClasses.icon} z-50`}
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Menu Overlay (Free Navigation) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-5 pt-20 px-6">
            <div className="flex flex-col gap-2 max-w-lg mx-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => handleMenuClick(item.view)}
                        className={`flex items-center gap-4 p-4 rounded-xl font-bold text-lg transition-all ${themeClasses.menuHover} ${currentView === item.view ? 'bg-gray-100' : ''}`}
                    >
                        <div className="opacity-70">{item.icon}</div>
                        {item.label}
                    </button>
                ))}
            </div>
            <div className="mt-8 text-center opacity-40 text-sm">
                LingoFlash Pro v1.0
            </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col p-4 max-w-lg mx-auto w-full transition-opacity duration-300 ${isMenuOpen ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        {children}
      </main>
    </div>
  );
};
