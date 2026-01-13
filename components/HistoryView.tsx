
import React, { useState, useEffect } from 'react';
import { SavedDiagnosis } from '../types';
import { APPLIANCES } from '../constants';

interface Props {
  onSelect: (saved: SavedDiagnosis) => void;
  onClose: () => void;
}

export const HistoryView: React.FC<Props> = ({ onSelect, onClose }) => {
  const [history, setHistory] = useState<SavedDiagnosis[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('diagnosis_history') || '[]');
    setHistory(stored);
  }, []);

  const deleteEntry = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Deseja excluir este registro?')) {
      const updated = history.filter(h => h.id !== id);
      localStorage.setItem('diagnosis_history', JSON.stringify(updated));
      setHistory(updated);
    }
  };

  const clearAll = () => {
    if (confirm('Deseja limpar todo o seu histórico de diagnósticos?')) {
      localStorage.removeItem('diagnosis_history');
      setHistory([]);
    }
  };

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(ts);
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 pb-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 leading-tight">Histórico</h2>
          <p className="text-slate-500 text-sm">Seus diagnósticos salvos localmente.</p>
        </div>
        <div className="flex gap-2">
          {history.length > 0 && (
            <button 
              onClick={clearAll}
              className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              title="Limpar Tudo"
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition-colors">
            <i className="fa-solid fa-circle-xmark text-2xl"></i>
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
            <i className="fa-solid fa-bookmark text-4xl"></i>
          </div>
          <h3 className="text-slate-700 font-bold mb-1">Nenhum diagnóstico salvo</h3>
          <p className="text-slate-400 text-sm px-10">Salve seus resultados para consultá-los rapidamente depois.</p>
          <button 
            onClick={onClose}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm"
          >
            Começar Diagnóstico
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => {
            const appInfo = APPLIANCES.find(a => a.id === item.appliance);
            return (
              <div 
                key={item.id}
                onClick={() => onSelect(item)}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-300 transition-all group cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${appInfo?.color || 'bg-slate-400'}`}>
                      <i className={`fa-solid ${appInfo?.icon || 'fa-plug'}`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 capitalize leading-none">{item.appliance}</h4>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formatDate(item.timestamp)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => deleteEntry(e, item.id)}
                    className="w-8 h-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
                
                <p className="text-sm text-slate-600 font-medium line-clamp-2 mb-3">
                  {item.problem.replace('-', ' ')}
                </p>

                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl border border-slate-100">
                   <span className="text-[10px] font-black uppercase text-slate-400">Custo Est.</span>
                   <span className="text-xs font-bold text-slate-700">{item.diagnosis.costRange}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
