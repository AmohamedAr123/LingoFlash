import React from 'react';
import { Language } from '../types';

interface UnfinishedProps {
  language: Language;
  onBack: () => void;
}

export const Unfinished: React.FC<UnfinishedProps> = ({ language, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      </div>
      
      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">لا يوجد تدريبات معلقة</h3>
        <p className="text-gray-400 text-sm">كل جلساتك السابقة مكتملة.</p>
      </div>

      <button 
        onClick={onBack}
        className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 font-medium hover:bg-gray-50"
      >
        العودة للقائمة
      </button>
    </div>
  );
};
