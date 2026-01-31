import React, { useState, useEffect } from 'react';
import { AppView, CardClass, Language, QuestionType, TrainingConfig, Unit } from '../types';
import { getMockCounts } from '../constants';
import { Check, Layers, Filter, ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react';

interface TrainingSetupProps {
  language: Language;
  units: Unit[];
  onStart: (config: TrainingConfig) => void;
}

export const TrainingSetup: React.FC<TrainingSetupProps> = ({ language, units, onStart }) => {
  // State
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [expandedUnitIds, setExpandedUnitIds] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<CardClass[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([]);
  const [limit, setLimit] = useState<number>(20);
  
  const [availableCounts, setAvailableCounts] = useState<{ [key in QuestionType]?: number }>({});

  const isFrench = language === Language.French;
  const themeColor = isFrench ? 'rose' : 'blue';

  // Available Classes
  const allClasses = [
    CardClass.Noun,
    CardClass.Verb,
    CardClass.Adjective,
    CardClass.Adverb,
    CardClass.Expression
  ];

  // Available Question Types based on Language
  const validQuestionTypes = isFrench 
    ? [QuestionType.Meaning, QuestionType.Gender, QuestionType.Conjugation]
    : [QuestionType.Meaning, QuestionType.Synonyms, QuestionType.Antonyms];

  // Effect: Recalculate counters when filters change
  useEffect(() => {
    const counts = getMockCounts(language, selectedClasses, selectedLessonIds);
    setAvailableCounts(counts);

    // Auto-deselect types if count drops to 0
    setSelectedTypes(prev => prev.filter(t => (counts[t] || 0) > 0));
  }, [language, selectedClasses, selectedLessonIds]);

  // Handlers
  const toggleUnitExpanded = (unitId: string) => {
    setExpandedUnitIds(prev => prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]);
  };

  const toggleAllInUnit = (unit: Unit) => {
      const allLessonIds = unit.lessons.map(l => l.id);
      const allSelected = allLessonIds.every(id => selectedLessonIds.includes(id));

      if (allSelected) {
          // Deselect all
          setSelectedLessonIds(prev => prev.filter(id => !allLessonIds.includes(id)));
      } else {
          // Select all (merge ensuring no duplicates)
          setSelectedLessonIds(prev => [...new Set([...prev, ...allLessonIds])]);
      }
  };

  const toggleLesson = (lessonId: string) => {
      setSelectedLessonIds(prev => prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]);
  };

  const toggleClass = (cls: CardClass) => {
    setSelectedClasses(prev => prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]);
  };

  const toggleType = (type: QuestionType) => {
    if ((availableCounts[type] || 0) === 0) return;
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const maxCardsAvailable = Math.max(...validQuestionTypes.map(t => selectedTypes.includes(t) ? (availableCounts[t] || 0) : 0), 0);
  
  // Section Wrapper Component
  const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children?: React.ReactNode }) => (
    <div className="mb-6 animate-fade-in">
      <h3 className={`flex items-center gap-2 font-bold mb-3 ${isFrench ? 'text-rose-800' : 'text-slate-800'}`}>
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="pb-24"> {/* Padding for sticky button */}
      
      {/* Scope / Units Selection */}
      <Section title="نطاق التدريب (Scope)" icon={<Layers size={18} />}>
        <div className="grid grid-cols-1 gap-3">
            {units.map(unit => {
                const unitLessonIds = unit.lessons.map(l => l.id);
                const selectedCount = unitLessonIds.filter(id => selectedLessonIds.includes(id)).length;
                const isFullySelected = unitLessonIds.length > 0 && selectedCount === unitLessonIds.length;
                const isPartiallySelected = selectedCount > 0 && selectedCount < unitLessonIds.length;
                const isExpanded = expandedUnitIds.includes(unit.id);

                return (
                    <div key={unit.id} className={`rounded-xl border transition-all overflow-hidden ${isExpanded ? 'bg-white shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                        {/* Unit Header */}
                        <div className="p-3 flex items-center justify-between">
                             <div 
                                className="flex items-center gap-3 flex-1 cursor-pointer"
                                onClick={() => toggleUnitExpanded(unit.id)}
                            >
                                <div className={`text-gray-400 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                                    <ChevronRight size={20} />
                                </div>
                                <div>
                                    <span className={`font-bold text-sm block ${isFullySelected || isPartiallySelected ? `text-${themeColor}-900` : 'text-gray-600'}`}>{unit.name}</span>
                                    <span className="text-xs text-gray-400">{selectedCount} / {unit.lessons.length} Selected</span>
                                </div>
                             </div>

                             <button 
                                onClick={(e) => { e.stopPropagation(); toggleAllInUnit(unit); }}
                                className={`p-2 rounded-full transition-colors ${
                                    isFullySelected 
                                    ? `text-${themeColor}-600 bg-${themeColor}-100` 
                                    : isPartiallySelected 
                                        ? `text-${themeColor}-600 bg-gray-100`
                                        : 'text-gray-300 hover:text-gray-500'
                                }`}
                             >
                                 {isFullySelected ? <CheckCircle2 size={24} fill="currentColor" className="text-white" /> : 
                                  isPartiallySelected ? <div className={`w-5 h-5 rounded-full border-2 border-${themeColor}-500 bg-${themeColor}-500 flex items-center justify-center`}><div className="w-2 h-0.5 bg-white"></div></div> :
                                  <Circle size={24} />
                                 }
                             </button>
                        </div>

                        {/* Lessons List (Expanded) */}
                        {isExpanded && (
                            <div className="border-t border-gray-100 bg-white">
                                {unit.lessons.length === 0 ? (
                                    <p className="p-4 text-center text-xs text-gray-400">No lessons available in this unit.</p>
                                ) : (
                                    unit.lessons.map(lesson => {
                                        const isSelected = selectedLessonIds.includes(lesson.id);
                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => toggleLesson(lesson.id)}
                                                className={`w-full text-left flex items-center justify-between p-3 pl-10 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0`}
                                            >
                                                <span className={`text-sm ${isSelected ? `font-medium text-${themeColor}-700` : 'text-gray-600'}`}>
                                                    {lesson.name}
                                                </span>
                                                <div className={`transition-colors ${isSelected ? `text-${themeColor}-500` : 'text-gray-200'}`}>
                                                    {isSelected ? <Check size={16} /> : <div className="w-4 h-4 rounded-full border border-gray-200" />}
                                                </div>
                                            </button>
                                        )
                                    })
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      </Section>

      {/* Class Selection */}
      <Section title="نوع الكلمات (Classes)" icon={<Filter size={18} />}>
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => setSelectedClasses([])}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                    selectedClasses.length === 0
                     ? `bg-${themeColor}-600 text-white border-${themeColor}-600`
                     : 'bg-white text-gray-500 border-gray-200'
                }`}
            >
                All Classes
            </button>
            {allClasses.map(cls => (
                <button
                    key={cls}
                    onClick={() => toggleClass(cls)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                        selectedClasses.includes(cls)
                        ? `bg-${themeColor}-100 text-${themeColor}-800 border-${themeColor}-300`
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                >
                    {cls}
                </button>
            ))}
        </div>
      </Section>

      {/* Question Types with Dynamic Counters */}
      <Section title="نوع الأسئلة (Mode)" icon={<Layers size={18} />}>
        <div className="grid grid-cols-1 gap-3">
            {validQuestionTypes.map(type => {
                const count = availableCounts[type] || 0;
                const isSelected = selectedTypes.includes(type);
                const isDisabled = count === 0;

                return (
                    <button
                        key={type}
                        onClick={() => toggleType(type)}
                        disabled={isDisabled}
                        className={`
                            relative flex items-center justify-between p-4 rounded-xl border transition-all
                            ${isDisabled ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
                            ${isSelected 
                                ? `bg-white border-${themeColor}-500 ring-1 ring-${themeColor}-500 shadow-md` 
                                : 'bg-white border-gray-200 hover:border-gray-300'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? `bg-${themeColor}-500 border-${themeColor}-500` : 'border-gray-300'}`}>
                                {isSelected && <Check size={14} color="white" />}
                            </div>
                            <span className={`font-medium ${isSelected ? `text-${themeColor}-900` : 'text-gray-700'}`}>
                                {type === QuestionType.Meaning && "اختبار المعاني (Meaning)"}
                                {type === QuestionType.Gender && "اختبار النوع (Gender)"}
                                {type === QuestionType.Conjugation && "اختبار التصريف (Conjugation)"}
                                {type === QuestionType.Synonyms && "المرادفات (Synonyms)"}
                                {type === QuestionType.Antonyms && "المضادات (Antonyms)"}
                            </span>
                        </div>
                        
                        {/* Dynamic Counter Badge */}
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            isDisabled 
                                ? 'bg-gray-200 text-gray-500' 
                                : isSelected 
                                    ? `bg-${themeColor}-100 text-${themeColor}-700` 
                                    : 'bg-gray-100 text-gray-600'
                        }`}>
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
      </Section>

      {/* Limit Input */}
      <Section title="عدد الكروت" icon={<Filter size={18} />}>
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
                <input 
                    type="range" 
                    min="5" 
                    max={Math.max(5, maxCardsAvailable)} 
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${themeColor}-600`}
                />
                <span className={`text-xl font-bold text-${themeColor}-800 w-12 text-center`}>
                    {limit}
                </span>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">
                الحد الأقصى المتاح بناءً على اختياراتك: {maxCardsAvailable}
            </p>
      </Section>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-0 right-0 px-4 max-w-lg mx-auto z-40">
        <button
            disabled={selectedTypes.length === 0}
            onClick={() => onStart({ language, selectedLessonIds, selectedClasses, selectedQuestionTypes: selectedTypes, cardLimit: limit })}
            className={`
                w-full py-4 rounded-2xl font-bold text-lg text-white shadow-xl transform transition-all active:scale-95
                ${selectedTypes.length === 0 ? 'bg-gray-400 cursor-not-allowed' : `bg-${themeColor}-600 hover:bg-${themeColor}-700`}
            `}
        >
            بدء الجلسة ({limit})
        </button>
      </div>

    </div>
  );
};
