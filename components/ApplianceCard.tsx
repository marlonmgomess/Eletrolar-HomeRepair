
import React from 'react';
import { Appliance } from '../types';

interface Props {
  appliance: Appliance;
  isSelected: boolean;
  onClick: () => void;
}

export const ApplianceCard: React.FC<Props> = ({ appliance, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 border-2 ${
        isSelected 
          ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-100' 
          : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg'
      }`}
    >
      <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${appliance.color} text-white text-2xl`}>
        <i className={`fa-solid ${appliance.icon}`}></i>
      </div>
      <span className="font-semibold text-slate-700">{appliance.label}</span>
      {isSelected && (
        <div className="absolute top-3 right-3 text-blue-600">
          <i className="fa-solid fa-circle-check"></i>
        </div>
      )}
    </button>
  );
};
