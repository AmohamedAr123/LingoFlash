import React, { useState } from 'react';
import { AppView, Language, TrainingConfig, Unit } from './types';
import { INITIAL_UNITS } from './constants';
import { Layout } from './components/Layout';
import { MainMenu } from './components/MainMenu';
import { TrainingSetup } from './components/TrainingSetup';
import { AddContent } from './components/AddContent';
import { Stats } from './components/Stats';
import { Unfinished } from './components/Unfinished';
import { RefreshCw, CheckCircle, HardDrive } from 'lucide-react';

const App: React.FC = () => {
  // Global State
  const [currentView, setCurrentView] = useState<AppView>(AppView.MainMenu);
  const [language, setLanguage] = useState<Language>(Language.French); 
  
  // Data State (Simulating DB)
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);

  // Unit Management Handlers
  const handleAddUnit = (name: string) => {
    const newUnit: Unit = {
      id: `u_${Date.now()}`,
      name,
      lessons: []
    };
    setUnits([...units, newUnit]);
  };

  const handleUpdateUnitName = (id: string, newName: string) => {
    setUnits(units.map(u => u.id === id ? { ...u, name: newName } : u));
  };

  const handleAddLesson = (unitId: string, lessonName: string) => {
    setUnits(units.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          lessons: [...u.lessons, { id: `l_${Date.now()}`, name: lessonName }]
        };
      }
      return u;
    }));
  };

  const handleUpdateLessonName = (unitId: string, lessonId: string, newName: string) => {
    setUnits(units.map(u => {
        if (u.id === unitId) {
            return {
                ...u,
                lessons: u.lessons.map(l => l.id === lessonId ? { ...l, name: newName } : l)
            };
        }
        return u;
    }));
  };

  // Navigation Handlers
  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView(AppView.MainMenu);
  };

  const handleStartTraining = (config: TrainingConfig) => {
    console.log("Starting Training with config:", config);
    alert("Training Logic will be implemented in the next task!");
  };

  // View Routing
  const renderView = () => {
    switch (currentView) {
      case AppView.MainMenu:
        return (
          <MainMenu 
            language={language} 
            setLanguage={setLanguage} 
            onNavigate={handleNavigate} 
          />
        );
      case AppView.TrainingSetup:
        return (
          <TrainingSetup 
            language={language} 
            units={units}
            onStart={handleStartTraining} 
          />
        );
      case AppView.AddContent:
        return (
          <AddContent 
            language={language} 
            units={units}
            onAddUnit={handleAddUnit}
            onUpdateUnit={handleUpdateUnitName}
            onAddLesson={handleAddLesson}
            onUpdateLesson={handleUpdateLessonName}
          />
        );
      case AppView.Stats:
        return <Stats language={language} />;
      case AppView.Unfinished:
        return <Unfinished language={language} onBack={handleBack} />;
      case AppView.Settings:
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-6 pt-10">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-2">
                    <HardDrive size={40} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Drive & Sync</h2>
                
                <div className="w-full bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-gray-600">Google Drive Status</span>
                        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">
                            <CheckCircle size={12} /> Connected
                        </span>
                    </div>
                    <div className="h-px bg-gray-100 mb-4"></div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Last Sync: 2 mins ago</span>
                        <button className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                            <RefreshCw size={14} /> Sync Now
                        </button>
                    </div>
                </div>

                <div className="w-full bg-white p-5 rounded-2xl border border-gray-200 shadow-sm opacity-50">
                    <h3 className="font-bold text-gray-400 mb-2">Application Settings</h3>
                    <p className="text-xs text-gray-400">More preferences will appear here.</p>
                </div>
            </div>
        );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      language={language} 
      onNavigate={handleNavigate}
      onBack={handleBack}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
