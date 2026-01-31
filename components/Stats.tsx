import React from 'react';
import { Language } from '../types';

interface StatsProps {
  language: Language;
}

export const Stats: React.FC<StatsProps> = ({ language }) => {
  const isFrench = language === Language.French;
  const themeColor = isFrench ? 'text-rose-600' : 'text-blue-600';

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
      <div className={`p-6 rounded-full bg-gray-100 ${themeColor}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
      </div>
      <h2 className="text-xl font-bold text-gray-800">صفحة الإحصائيات</h2>
      <p className="max-w-xs text-gray-500">
        سيتم عرض منحنيات التقدم، الكلمات الأكثر خطأً، وتفاصيل الأداء هنا.
      </p>
    </div>
  );
};
