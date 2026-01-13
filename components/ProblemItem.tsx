
import React from 'react';
import { Problem } from '../types';

interface Props {
  problem: Problem;
  isSelected: boolean;
  onClick: () => void;
}

export const ProblemItem: React.FC<Props> = ({ problem, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-4 mb-3 rounded-xl border-2 transition-all ${
        isSelected 
          ? 'border-blue-600 bg-blue-50' 
          : 'border-slate-100 bg-white hover:bg-slate-50'
      }`}
    >
      <div className={`w-10 h-10 flex items-center justify-center rounded-lg mr-4 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
        <i className={`fa-solid ${problem.icon}`}></i>
      </div>
      <span className={`flex-1 text-left font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
        {problem.label}
      </span>
      {isSelected && <i className="fa-solid fa-chevron-right text-blue-600"></i>}
    </button>
  );
};
