import React from 'react';
import { Play, Plus, BarChart3, Clock } from 'lucide-react';
import { AppView, Language } from '../types';

interface MainMenuProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onNavigate: (view: AppView) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ language, setLanguage, onNavigate }) => {
  const isFrench = language === Language.French;

  // Dynamic Styles
  const activeLangClass = isFrench 
    ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' 
    : 'bg-blue-600 text-white shadow-lg shadow-blue-200';
  
  const inactiveLangClass = 'bg-white text-gray-500 hover:bg-gray-100';

  const buttonBaseClass = `
    flex items-center justify-between w-full p-5 rounded-2xl mb-4 
    transform transition-all duration-200 active:scale-95 shadow-sm border
  `;

  const getThemeButtonClass = () => {
     return isFrench 
        ? 'bg-white border-rose-100 hover:border-rose-300 text-rose-900' 
        : 'bg-white border-slate-100 hover:border-slate-300 text-slate-900';
  }

  const getIconBg = () => isFrench ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600';

  return (
    <div className="flex flex-col h-full justify-end pb-8">
      
      {/* Identity / Logo Area (Spacer for aesthetics) */}
      <div className="flex-1 flex flex-col items-center justify-center opacity-80 mb-8">
        <div className={`w-24 h-24 rounded-full mb-4 flex items-center justify-center text-4xl font-bold ${isFrench ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
            LF
        </div>
        <h2 className="text-2xl font-light tracking-widest">LingoFlash</h2>
      </div>

      {/* Language Toggle */}
      <div className="flex rounded-full bg-gray-200 p-1 mb-10 w-64 mx-auto">
        <button
          onClick={() => setLanguage(Language.French)}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-300 ${language === Language.French ? activeLangClass : inactiveLangClass}`}
        >
          Français
        </button>
        <button
          onClick={() => setLanguage(Language.English)}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-300 ${language === Language.English ? activeLangClass : inactiveLangClass}`}
        >
          English
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-3 w-full">
        
        {/* Start Training */}
        <button 
            onClick={() => onNavigate(AppView.TrainingSetup)}
            className={`${buttonBaseClass} ${getThemeButtonClass()} border-b-4`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${getIconBg()}`}>
                <Play size={24} fill="currentColor" />
            </div>
            <div className="text-right">
                <span className="block font-bold text-lg">بدء التدريب</span>
                <span className="text-xs opacity-60">Start Training</span>
            </div>
          </div>
        </button>

        {/* Add Content */}
        <button 
             onClick={() => onNavigate(AppView.AddContent)}
            className={`${buttonBaseClass} ${getThemeButtonClass()}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${getIconBg()}`}>
                <Plus size={24} />
            </div>
            <div className="text-right">
                <span className="block font-bold text-lg">إضافة محتوى</span>
                <span className="text-xs opacity-60">Add Content</span>
            </div>
          </div>
        </button>

        <div className="flex gap-3">
             {/* Status */}
            <button 
                onClick={() => onNavigate(AppView.Stats)}
                className={`${buttonBaseClass} ${getThemeButtonClass()} flex-1 flex-col items-start gap-2 mb-0`}
            >
                <div className={`p-2 rounded-lg ${getIconBg()}`}>
                    <BarChart3 size={20} />
                </div>
                <div>
                    <span className="block font-bold">الإحصائيات</span>
                </div>
            </button>

             {/* Unfinished */}
             <button 
                onClick={() => onNavigate(AppView.Unfinished)}
                className={`${buttonBaseClass} ${getThemeButtonClass()} flex-1 flex-col items-start gap-2 mb-0`}
            >
                <div className={`p-2 rounded-lg ${getIconBg()}`}>
                    <Clock size={20} />
                </div>
                <div>
                    <span className="block font-bold">تدريبات معلقة</span>
                </div>
            </button>
        </div>

      </div>
    </div>
  );
};
