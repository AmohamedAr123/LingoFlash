import React, { useState } from 'react';
import { AppView, Language, Unit } from '../types';
import { Upload, FileText, CheckSquare, Edit3, Plus, Save, X } from 'lucide-react';

interface AddContentProps {
  language: Language;
  units: Unit[];
  onAddUnit: (name: string) => void;
  onUpdateUnit: (id: string, name: string) => void;
  onAddLesson: (unitId: string, name: string) => void;
  onUpdateLesson: (unitId: string, lessonId: string, name: string) => void;
}

export const AddContent: React.FC<AddContentProps> = ({ 
  language, 
  units, 
  onAddUnit, 
  onUpdateUnit, 
  onAddLesson,
  onUpdateLesson
}) => {
  const isFrench = language === Language.French;
  const themeColor = isFrench ? 'rose' : 'blue';

  const [files, setFiles] = useState<File[]>([]);
  const [extractMeaning, setExtractMeaning] = useState(true);
  const [extractConjugation, setExtractConjugation] = useState(false);
  
  // Destination State
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  
  // Editing State
  const [isEditingUnit, setIsEditingUnit] = useState(false);
  const [editUnitName, setEditUnitName] = useState('');
  
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');

  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonName, setNewLessonName] = useState('');

  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [editLessonName, setEditLessonName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
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

  return (
    <div className="space-y-6 pb-10">
      
      {/* File Upload Zone */}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors relative">
        <input 
            type="file" 
            multiple 
            accept="image/*, application/pdf"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
        />
        <div className={`p-4 rounded-full bg-${themeColor}-50 mb-4`}>
            <Upload className={`text-${themeColor}-500`} size={32} />
        </div>
        <p className="font-bold text-gray-700 text-lg">اضغط لرفع الملفات</p>
        <p className="text-gray-400 text-sm mt-1">Images or PDFs supported</p>
        
        {files.length > 0 && (
             <div className="mt-4 w-full">
                <p className={`text-xs font-bold text-${themeColor}-600 mb-2 uppercase tracking-wider`}>{files.length} Files Selected</p>
                <div className="flex flex-wrap gap-2">
                    {files.map((f, i) => (
                        <div key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs truncate max-w-[150px]">
                            {f.name}
                        </div>
                    ))}
                </div>
             </div>
        )}
      </div>

      {/* Target Destination - Dynamic Units & Lessons */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm animate-fade-in">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <LayersIcon color={themeColor} />
            الوجهة (Destination)
        </h3>
        
        <div className="space-y-4">
            
            {/* UNIT SELECTION */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-gray-500">المجموعة (Unit)</label>
                    {selectedUnitId && !isEditingUnit && !isAddingUnit && (
                        <button 
                            onClick={() => {
                                setEditUnitName(selectedUnit?.name || '');
                                setIsEditingUnit(true);
                            }}
                            className={`text-xs font-bold text-${themeColor}-600 flex items-center gap-1 hover:underline`}
                        >
                            <Edit3 size={12} /> Rename
                        </button>
                    )}
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
                     {selectedLessonId && !isEditingLesson && !isAddingLesson && (
                        <button 
                            onClick={() => {
                                setEditLessonName(selectedLesson?.name || '');
                                setIsEditingLesson(true);
                            }}
                            className={`text-xs font-bold text-${themeColor}-600 flex items-center gap-1 hover:underline`}
                        >
                            <Edit3 size={12} /> Rename
                        </button>
                    )}
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

      {/* Extraction Logic */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm animate-fade-in">
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
      
       {/* Submit */}
       <button className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-${themeColor}-200 bg-${themeColor}-600 hover:bg-${themeColor}-700 active:scale-95 transition-all`}>
            بدء المعالجة
       </button>

    </div>
  );
};

// Small Icons for this file
const CheckIcon = ({size}: {size: number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const LayersIcon = ({color}: {color: string}) => <div className={`w-6 h-6 rounded flex items-center justify-center bg-${color}-100 text-${color}-600`}><FileText size={14} /></div>;
const SettingsIcon = ({color}: {color: string}) => <div className={`w-6 h-6 rounded flex items-center justify-center bg-${color}-100 text-${color}-600`}><CheckSquare size={14} /></div>;
