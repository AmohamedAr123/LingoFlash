import React, { useState, useEffect } from 'react';
import { AppView, Language, Unit, Card, CardClass, Gender, VerbType } from '../types';
import { Upload, FileText, CheckSquare, Edit3, Plus, Save, X, Loader2, CheckCircle, PenTool, Type, Trash2 } from 'lucide-react';
import { splitFrenchArticle } from '../utils/ocrEngine';

interface AddContentProps {
  language: Language;
  units: Unit[];
  onAddUnit: (name: string) => void;
  onUpdateUnit: (id: string, name: string) => void;
  onDeleteUnit: (id: string) => void;
  onAddLesson: (unitId: string, name: string) => void;
  onUpdateLesson: (unitId: string, lessonId: string, name: string) => void;
  onDeleteLesson: (unitId: string, lessonId: string) => void;
  onProcessContent: (files: File[], unitId: string, lessonId: string) => Promise<number>;
  onManualAdd: (card: Card) => void;
}

export const AddContent: React.FC<AddContentProps> = ({ 
  language, 
  units, 
  onAddUnit, 
  onUpdateUnit, 
  onDeleteUnit,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onProcessContent,
  onManualAdd
}) => {
  const isFrench = language === Language.French;
  const themeColor = isFrench ? 'rose' : 'blue';

  const [files, setFiles] = useState<File[]>([]);
  const [extractMeaning, setExtractMeaning] = useState(true);
  const [extractConjugation, setExtractConjugation] = useState(false);
  
  // Destination State
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  
  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<number | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualSuccessMsg, setManualSuccessMsg] = useState('');

  // Manual Input State
  const [manualWord, setManualWord] = useState('');
  const [manualTranslation, setManualTranslation] = useState('');
  const [manualClass, setManualClass] = useState<CardClass>(CardClass.Noun);
  const [manualGender, setManualGender] = useState<Gender>(Gender.Masc);
  
  // Conjugation State (6 slots: je, tu, il/elle, nous, vous, ils/elles)
  const [manualConjugations, setManualConjugations] = useState<string[]>(['', '', '', '', '', '']);

  // Editing State
  const [isEditingUnit, setIsEditingUnit] = useState(false);
  const [editUnitName, setEditUnitName] = useState('');
  
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');

  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonName, setNewLessonName] = useState('');

  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [editLessonName, setEditLessonName] = useState('');

  // Validate selection when units/lessons are deleted
  useEffect(() => {
    if (selectedUnitId && !units.find(u => u.id === selectedUnitId)) {
        setSelectedUnitId('');
        setSelectedLessonId('');
    }
    if (selectedUnitId && selectedLessonId) {
        const unit = units.find(u => u.id === selectedUnitId);
        if (unit && !unit.lessons.find(l => l.id === selectedLessonId)) {
            setSelectedLessonId('');
        }
    }
  }, [units, selectedUnitId, selectedLessonId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setProcessingResult(null); // Reset result when new files selected
    }
  };

  const handleConjugationChange = (index: number, value: string) => {
    const newConj = [...manualConjugations];
    newConj[index] = value;
    setManualConjugations(newConj);
  };

  const handleStartProcessing = async () => {
      if (files.length === 0 || !selectedUnitId || !selectedLessonId) return;
      
      setIsProcessing(true);
      try {
          const count = await onProcessContent(files, selectedUnitId, selectedLessonId);
          setProcessingResult(count);
          setFiles([]); // Clear files after success
      } catch (error) {
          console.error("Processing failed", error);
      } finally {
          setIsProcessing(false);
      }
  };

  const handleSaveManualCard = () => {
      if (!manualWord.trim() || !manualTranslation.trim() || !selectedUnitId || !selectedLessonId) return;

      // 1. Intelligent Article Splitting (reusing OCR logic)
      let finalWord = manualWord.trim();
      let article = undefined;

      if (language === Language.French) {
          const split = splitFrenchArticle(finalWord);
          finalWord = split.word;
          article = split.article;
      }

      // Check if Verb conjugations are filled if class is Verb
      let finalConjugations = undefined;
      if (manualClass === CardClass.Verb) {
          finalConjugations = manualConjugations; 
      }

      // 2. Prepare Card Object
      const newCard: Card = {
          id: `manual_${Date.now()}`,
          word: finalWord,
          article: article,
          translation: manualTranslation.trim(),
          class: manualClass,
          gender: manualClass === CardClass.Noun ? manualGender : Gender.None,
          language,
          unitId: selectedUnitId,
          lessonId: selectedLessonId,
          createdAt: Date.now(),
          
          // Verb Specific Data
          infinitive: manualClass === CardClass.Verb ? finalWord : undefined,
          verbType: manualClass === CardClass.Verb ? VerbType.Regular : undefined,
          conjugations: finalConjugations
      };

      onManualAdd(newCard);
      
      // Reset Form & Show Feedback
      setManualWord('');
      setManualTranslation('');
      setManualConjugations(['', '', '', '', '', '']); // Reset conjugations
      setManualSuccessMsg('تمت الإضافة!');
      setTimeout(() => setManualSuccessMsg(''), 2000);
  };

  // Logic to handle saving a new unit
  const saveNewUnit = () => {
    if (newUnitName.trim()) {
        onAddUnit(newUnitName);
        setNewUnitName('');
        setIsAddingUnit(false);
    }
  };

  // Logic to update unit name
  const saveUnitUpdate = () => {
    if (editUnitName.trim() && selectedUnitId) {
        onUpdateUnit(selectedUnitId, editUnitName);
        setIsEditingUnit(false);
    }
  };

  // Logic to add lesson
  const saveNewLesson = () => {
      if (newLessonName.trim() && selectedUnitId) {
          onAddLesson(selectedUnitId, newLessonName);
          setNewLessonName('');
          setIsAddingLesson(false);
      }
  }

  // Logic to update lesson name
  const saveLessonUpdate = () => {
      if (editLessonName.trim() && selectedUnitId && selectedLessonId) {
          onUpdateLesson(selectedUnitId, selectedLessonId, editLessonName);
          setIsEditingLesson(false);
      }
  }

  const selectedUnit = units.find(u => u.id === selectedUnitId);
  const selectedLesson = selectedUnit?.lessons.find(l => l.id === selectedLessonId);

  // --- RESULT VIEW ---
  if (processingResult !== null) {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-fade-in">
              <div className={`w-24 h-24 bg-${themeColor}-100 rounded-full flex items-center justify-center text-${themeColor}-600`}>
                  <CheckCircle size={48} />
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">تمت المعالجة بنجاح!</h3>
                  <p className="text-gray-500">
                      تم استخراج وإضافة <span className="font-bold text-black">{processingResult}</span> كارت جديد إلى قاعدة البيانات.
                  </p>
              </div>
              <button 
                  onClick={() => setProcessingResult(null)}
                  className={`px-8 py-3 rounded-xl bg-${themeColor}-600 text-white font-bold shadow-lg hover:shadow-xl transition-all`}
              >
                  إضافة المزيد
              </button>
          </div>
      );
  }

  return (
    <div className="space-y-6 pb-10">
      
      {/* 1. INPUT METHOD TOGGLE */}
      {!manualMode ? (
        <div className={`border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors relative ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
            <input 
                type="file" 
                multiple 
                accept="image/*, application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                disabled={isProcessing}
            />
            <div className={`p-4 rounded-full bg-${themeColor}-50 mb-4`}>
                <Upload className={`text-${themeColor}-500`} size={32} />
            </div>
            <p className="font-bold text-gray-700 text-lg">اضغط لرفع الملفات (Scan)</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">Images or PDFs supported</p>
            
            {files.length > 0 && (
                <div className="mt-2 w-full">
                    <p className={`text-xs font-bold text-${themeColor}-600 mb-2 uppercase tracking-wider`}>{files.length} Files Selected</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {files.map((f, i) => (
                            <div key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs truncate max-w-[150px]">
                                {f.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2 mt-4 w-full">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs text-gray-400 font-bold">OR</span>
                <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setManualMode(true); }}
                className={`mt-4 z-10 text-${themeColor}-600 font-bold text-sm hover:underline flex items-center gap-1`}
            >
                <PenTool size={14} /> استخدم الإدخال اليدوي (Manual Input)
            </button>
        </div>
      ) : (
          // MANUAL INPUT FORM
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm animate-fade-in relative">
              <button 
                onClick={() => setManualMode(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                  <X size={20} />
              </button>
              
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PenTool color={themeColor} size={18} />
                إدخال يدوي (Manual Entry)
              </h3>

              <div className="space-y-4">
                  {/* WORD */}
                  <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">الكلمة ({isFrench ? 'French' : 'English'})</label>
                      <input 
                        type="text" 
                        value={manualWord}
                        onChange={e => setManualWord(e.target.value)}
                        placeholder={isFrench ? "e.g., la table / manger" : "e.g., table / run"}
                        className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                      {isFrench && manualWord.includes(' ') && (
                          <p className={`text-[10px] mt-1 text-${themeColor}-600`}>* سيقوم النظام بفصل الأداة تلقائياً.</p>
                      )}
                  </div>

                  {/* TRANSLATION */}
                  <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">الترجمة (Arabic)</label>
                      <input 
                        type="text" 
                        value={manualTranslation}
                        onChange={e => setManualTranslation(e.target.value)}
                        placeholder="e.g., طاولة / يأكل / سريعاً"
                        className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-right"
                        dir="rtl"
                      />
                  </div>

                  {/* CLASS & GENDER */}
                  <div className="flex gap-4">
                      <div className="flex-1">
                          <label className="text-xs font-bold text-gray-500 mb-1 block">النوع (Class)</label>
                          <select 
                            value={manualClass}
                            onChange={e => setManualClass(e.target.value as CardClass)}
                            className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none"
                          >
                              {Object.values(CardClass).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                      </div>
                      
                      {isFrench && manualClass === CardClass.Noun && (
                           <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 mb-1 block">الجنس (Gender)</label>
                                <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-300">
                                    <button 
                                        onClick={() => setManualGender(Gender.Masc)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${manualGender === Gender.Masc ? `bg-${themeColor}-100 text-${themeColor}-700` : 'text-gray-400'}`}
                                    >
                                        Masc
                                    </button>
                                    <button 
                                        onClick={() => setManualGender(Gender.Fem)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${manualGender === Gender.Fem ? `bg-${themeColor}-100 text-${themeColor}-700` : 'text-gray-400'}`}
                                    >
                                        Fem
                                    </button>
                                </div>
                           </div>
                      )}
                  </div>

                  {/* CONJUGATION GRID (Fixed Layout: Labels above Input) */}
                  {manualClass === CardClass.Verb && (
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <label className="text-xs font-bold text-gray-500 mb-3 block flex items-center gap-2">
                             <Type size={12}/>
                             تصريف الفعل (Conjugation)
                             <span className="text-[10px] font-normal text-gray-400">- Optional</span>
                          </label>
                          
                          {/* 2 Columns: Singular vs Plural */}
                          <div className="grid grid-cols-2 gap-4">
                              
                              {/* Singular */}
                              <div className="space-y-3">
                                  <div>
                                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Je</span>
                                      <input 
                                        type="text" 
                                        value={manualConjugations[0]} 
                                        onChange={e => handleConjugationChange(0, e.target.value)} 
                                        className="w-full p-2 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-400 bg-white" 
                                        placeholder="..." 
                                      />
                                  </div>
                                  <div>
                                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Tu</span>
                                      <input 
                                        type="text" 
                                        value={manualConjugations[1]} 
                                        onChange={e => handleConjugationChange(1, e.target.value)} 
                                        className="w-full p-2 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-400 bg-white" 
                                        placeholder="..." 
                                      />
                                  </div>
                                  <div>
                                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Il / Elle</span>
                                      <input 
                                        type="text" 
                                        value={manualConjugations[2]} 
                                        onChange={e => handleConjugationChange(2, e.target.value)} 
                                        className="w-full p-2 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-400 bg-white" 
                                        placeholder="..." 
                                      />
                                  </div>
                              </div>

                              {/* Plural */}
                              <div className="space-y-3">
                                  <div>
                                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Nous</span>
                                      <input 
                                        type="text" 
                                        value={manualConjugations[3]} 
                                        onChange={e => handleConjugationChange(3, e.target.value)} 
                                        className="w-full p-2 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-400 bg-white" 
                                        placeholder="..." 
                                      />
                                  </div>
                                  <div>
                                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Vous</span>
                                      <input 
                                        type="text" 
                                        value={manualConjugations[4]} 
                                        onChange={e => handleConjugationChange(4, e.target.value)} 
                                        className="w-full p-2 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-400 bg-white" 
                                        placeholder="..." 
                                      />
                                  </div>
                                  <div>
                                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Ils / Elles</span>
                                      <input 
                                        type="text" 
                                        value={manualConjugations[5]} 
                                        onChange={e => handleConjugationChange(5, e.target.value)} 
                                        className="w-full p-2 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-400 bg-white" 
                                        placeholder="..." 
                                      />
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* SAVE BUTTON */}
                  <button 
                    onClick={handleSaveManualCard}
                    disabled={!selectedUnitId || !selectedLessonId || !manualWord || !manualTranslation}
                    className={`
                        w-full py-3 mt-2 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2
                        ${!selectedUnitId || !selectedLessonId ? 'bg-gray-300 cursor-not-allowed' : `bg-${themeColor}-600 hover:bg-${themeColor}-700 active:scale-95`}
                    `}
                  >
                      {manualSuccessMsg ? <span className="flex items-center gap-1"><CheckCircle size={18}/> {manualSuccessMsg}</span> : <><Plus size={18}/> حفظ الكارت (Add Card)</>}
                  </button>
                  
                  {(!selectedUnitId || !selectedLessonId) && (
                      <p className="text-xs text-red-400 text-center">يرجى اختيار الوحدة والدرس بالأسفل أولاً</p>
                  )}
              </div>
          </div>
      )}

      {/* Target Destination - Dynamic Units & Lessons */}
      <div className={`bg-white p-5 rounded-2xl border border-gray-200 shadow-sm animate-fade-in ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <LayersIcon color={themeColor} />
            الوجهة (Destination)
        </h3>
        
        <div className="space-y-4">
            
            {/* UNIT SELECTION */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-gray-500">المجموعة (Unit)</label>
                    <div className="flex items-center gap-3">
                        {selectedUnitId && !isEditingUnit && !isAddingUnit && (
                            <>
                                <button 
                                    type="button"
                                    onClick={() => onDeleteUnit(selectedUnitId)}
                                    className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                    <Trash2 size={12} /> Delete
                                </button>
                                <button 
                                    onClick={() => {
                                        setEditUnitName(selectedUnit?.name || '');
                                        setIsEditingUnit(true);
                                    }}
                                    className={`text-xs font-bold text-${themeColor}-600 flex items-center gap-1 hover:underline`}
                                >
                                    <Edit3 size={12} /> Rename
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {isAddingUnit ? (
                    <div className="flex gap-2">
                        <input 
                            autoFocus
                            type="text"
                            value={newUnitName}
                            onChange={e => setNewUnitName(e.target.value)}
                            placeholder="New Unit Name..."
                            className="flex-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={saveNewUnit} className={`p-3 rounded-xl bg-${themeColor}-600 text-white`}><Save size={20}/></button>
                        <button onClick={() => setIsAddingUnit(false)} className="p-3 rounded-xl bg-gray-200 text-gray-600"><X size={20}/></button>
                    </div>
                ) : isEditingUnit ? (
                     <div className="flex gap-2">
                        <input 
                            autoFocus
                            type="text"
                            value={editUnitName}
                            onChange={e => setEditUnitName(e.target.value)}
                            className="flex-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={saveUnitUpdate} className={`p-3 rounded-xl bg-${themeColor}-600 text-white`}><Save size={20}/></button>
                        <button onClick={() => setIsEditingUnit(false)} className="p-3 rounded-xl bg-gray-200 text-gray-600"><X size={20}/></button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <select 
                            value={selectedUnitId}
                            onChange={(e) => {
                                setSelectedUnitId(e.target.value);
                                setSelectedLessonId('');
                            }}
                            className="flex-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 text-gray-700"
                        >
                            <option value="">-- اختر مجموعة --</option>
                            {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                        <button 
                            onClick={() => setIsAddingUnit(true)}
                            className={`p-3 rounded-xl bg-${themeColor}-50 text-${themeColor}-600 border border-${themeColor}-200 hover:bg-${themeColor}-100`}
                            title="Add New Unit"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* LESSON SELECTION (Only if Unit selected) */}
            <div className={`transition-all duration-300 ${selectedUnitId ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                 <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-gray-500">القسم (Lesson)</label>
                     <div className="flex items-center gap-3">
                        {selectedLessonId && !isEditingLesson && !isAddingLesson && (
                            <>
                                <button 
                                    type="button"
                                    onClick={() => onDeleteLesson(selectedUnitId, selectedLessonId)}
                                    className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                    <Trash2 size={12} /> Delete
                                </button>
                                <button 
                                    onClick={() => {
                                        setEditLessonName(selectedLesson?.name || '');
                                        setIsEditingLesson(true);
                                    }}
                                    className={`text-xs font-bold text-${themeColor}-600 flex items-center gap-1 hover:underline`}
                                >
                                    <Edit3 size={12} /> Rename
                                </button>
                            </>
                        )}
                    </div>
                 </div>
                
                {isAddingLesson ? (
                     <div className="flex gap-2">
                        <input 
                            autoFocus
                            type="text"
                            value={newLessonName}
                            onChange={e => setNewLessonName(e.target.value)}
                            placeholder="New Lesson Name..."
                            className="flex-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={saveNewLesson} className={`p-3 rounded-xl bg-${themeColor}-600 text-white`}><Save size={20}/></button>
                        <button onClick={() => setIsAddingLesson(false)} className="p-3 rounded-xl bg-gray-200 text-gray-600"><X size={20}/></button>
                    </div>
                ) : isEditingLesson ? (
                     <div className="flex gap-2">
                        <input 
                            autoFocus
                            type="text"
                            value={editLessonName}
                            onChange={e => setEditLessonName(e.target.value)}
                            className="flex-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={saveLessonUpdate} className={`p-3 rounded-xl bg-${themeColor}-600 text-white`}><Save size={20}/></button>
                        <button onClick={() => setIsEditingLesson(false)} className="p-3 rounded-xl bg-gray-200 text-gray-600"><X size={20}/></button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                         <select 
                            value={selectedLessonId}
                            onChange={(e) => setSelectedLessonId(e.target.value)}
                            className="flex-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 text-gray-700"
                        >
                            <option value="">-- اختر قسم --</option>
                            {selectedUnit?.lessons.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                        <button 
                             onClick={() => setIsAddingLesson(true)}
                            className={`p-3 rounded-xl bg-${themeColor}-50 text-${themeColor}-600 border border-${themeColor}-200 hover:bg-${themeColor}-100`}
                            title="Add New Lesson"
                        >
                             <Plus size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Extraction Logic - ONLY SHOW IF NOT MANUAL MODE (AI Context) */}
      {!manualMode && (
        <div className={`bg-white p-5 rounded-2xl border border-gray-200 shadow-sm animate-fade-in ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <SettingsIcon color={themeColor} />
                إعدادات الاستخراج (AI Extraction)
            </h3>
            
            <div className="space-y-3">
                <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${extractMeaning ? `bg-${themeColor}-50 border-${themeColor}-500` : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                        type="checkbox" 
                        checked={extractMeaning} 
                        onChange={e => setExtractMeaning(e.target.checked)}
                        className="hidden"
                    />
                    <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors ${extractMeaning ? `bg-${themeColor}-500 border-${themeColor}-500` : 'border-gray-300'}`}>
                        {extractMeaning && <CheckIcon size={12} />}
                    </div>
                    <div>
                        <span className={`font-bold text-sm block ${extractMeaning ? `text-${themeColor}-900` : 'text-gray-700'}`}>استخراج المعاني والنوع</span>
                        <span className="text-xs text-gray-500">Meaning & Gender Cards</span>
                    </div>
                </label>

                <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${extractConjugation ? `bg-${themeColor}-50 border-${themeColor}-500` : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                        type="checkbox" 
                        checked={extractConjugation} 
                        onChange={e => setExtractConjugation(e.target.checked)}
                        className="hidden"
                    />
                    <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors ${extractConjugation ? `bg-${themeColor}-500 border-${themeColor}-500` : 'border-gray-300'}`}>
                        {extractConjugation && <CheckIcon size={12} />}
                    </div>
                    <div>
                        <span className={`font-bold text-sm block ${extractConjugation ? `text-${themeColor}-900` : 'text-gray-700'}`}>استخراج الأفعال والتصريفات</span>
                        <span className="text-xs text-gray-500">Conjugation Cards</span>
                    </div>
                </label>
            </div>
        </div>
      )}
      
       {/* Submit Button (Only for File Upload Mode) */}
       {!manualMode && (
            <button 
                    onClick={handleStartProcessing}
                    disabled={isProcessing || files.length === 0 || !selectedUnitId || !selectedLessonId}
                    className={`
                        w-full py-4 rounded-2xl font-bold text-white shadow-xl transform transition-all 
                        ${isProcessing || files.length === 0 || !selectedUnitId || !selectedLessonId
                            ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                            : `bg-${themeColor}-600 hover:bg-${themeColor}-700 active:scale-95 shadow-${themeColor}-200`
                        }
                    `}
            >
                    {isProcessing ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={20} />
                            جاري المعالجة...
                        </div>
                    ) : (
                        "بدء المعالجة (Start Processing)"
                    )}
            </button>
       )}

    </div>
  );
};

// Small Icons for this file
const CheckIcon = ({size}: {size: number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const LayersIcon = ({color}: {color: string}) => <div className={`w-6 h-6 rounded flex items-center justify-center bg-${color}-100 text-${color}-600`}><FileText size={14} /></div>;
const SettingsIcon = ({color}: {color: string}) => <div className={`w-6 h-6 rounded flex items-center justify-center bg-${color}-100 text-${color}-600`}><CheckSquare size={14} /></div>;
