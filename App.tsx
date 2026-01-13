
import React, { useState, useEffect } from 'react';
import { APPLIANCES, GENERIC_PROBLEMS, SPECIFIC_PROBLEMS, BASE_DIAGNOSES } from './constants';
import { ApplianceType, ProblemType, Diagnosis, Problem, SavedDiagnosis } from './types';
import { ApplianceCard } from './components/ApplianceCard';
import { ProblemItem } from './components/ProblemItem';
import { DiagnosisView } from './components/DiagnosisView';
import { TechnicianPortal } from './components/TechnicianPortal';
import { HistoryView } from './components/HistoryView';
import { ChatBot } from './components/ChatBot';
import { getDiagnosisFromText } from './services/geminiService';

const App: React.FC = () => {
  const [mode, setMode] = useState<'user' | 'technician' | 'history'>('user');
  const [step, setStep] = useState(1);
  const [selectedAppliance, setSelectedAppliance] = useState<ApplianceType | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [customProblem, setCustomProblem] = useState('');
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, mode]);

  const handleNextStep = async () => {
    if (step === 1 && selectedAppliance) {
      setStep(2);
    } else if (step === 2) {
      if (customProblem.trim().length > 5) {
        setIsLoading(true);
        const aiDiagnosis = await getDiagnosisFromText(selectedAppliance!, customProblem);
        if (aiDiagnosis) {
          setDiagnosis(aiDiagnosis);
          setStep(3);
        } else {
          alert("Não foi possível gerar um diagnóstico automático. Tente selecionar uma opção da lista.");
        }
        setIsLoading(false);
      } else if (selectedProblem) {
        const key = `${selectedAppliance}-${selectedProblem}`;
        const result = BASE_DIAGNOSES[key] || BASE_DIAGNOSES['default'];
        setDiagnosis(result);
        setStep(3);
      }
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 2) setSelectedProblem(null);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedAppliance(null);
    setSelectedProblem(null);
    setCustomProblem('');
    setDiagnosis(null);
    setMode('user');
  };

  const openSavedDiagnosis = (saved: SavedDiagnosis) => {
    setSelectedAppliance(saved.appliance);
    setSelectedProblem(saved.problem);
    setDiagnosis(saved.diagnosis);
    setMode('user');
    setStep(3);
  };

  const currentApplianceLabel = APPLIANCES.find(a => a.id === selectedAppliance)?.label || 'Aparelho';
  
  const availableProblems: Problem[] = selectedAppliance 
    ? [...SPECIFIC_PROBLEMS[selectedAppliance], ...GENERIC_PROBLEMS]
    : GENERIC_PROBLEMS;

  return (
    <div className="min-h-screen pb-20 sm:pb-12 bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 py-4 pt-[safe-area-inset-top]">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3" onClick={handleReset} style={{ cursor: 'pointer' }}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 shrink-0">
              <i className="fa-solid fa-screwdriver-wrench text-white text-lg"></i>
            </div>
            <div className="overflow-hidden">
              <h1 className="font-bold text-slate-800 leading-tight truncate">Eletrolar HomeRepair</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Assistente Inteligente</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {mode === 'user' && step === 1 && (
              <button 
                onClick={() => setMode('history')}
                className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all"
                title="Histórico"
              >
                <i className="fa-solid fa-clock-rotate-left"></i>
              </button>
            )}
            
            {mode === 'user' && step > 1 && !isLoading && (
              <button 
                onClick={handleBackStep}
                className="text-blue-600 active:bg-blue-50 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1 transition-all"
              >
                <i className="fa-solid fa-chevron-left text-xs"></i> Voltar
              </button>
            )}
            
            {(mode === 'technician' || mode === 'history') && (
              <button 
                onClick={() => setMode('user')}
                className="text-blue-600 px-3 py-2 rounded-lg text-sm font-bold"
              >
                Fechar
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-6 flex-1 w-full">
        {mode === 'technician' ? (
          <TechnicianPortal onClose={() => setMode('user')} />
        ) : mode === 'history' ? (
          <HistoryView 
            onSelect={openSavedDiagnosis}
            onClose={() => setMode('user')}
          />
        ) : (
          <>
            {/* Step Indicator */}
            {step < 3 && !isLoading && (
              <div className="mb-8 flex items-center justify-between px-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex flex-col items-center gap-2 flex-1 relative">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 z-10 ${
                      step === s ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100' : 
                      step > s ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {step > s ? <i className="fa-solid fa-check"></i> : s}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-tighter ${step >= s ? 'text-slate-700' : 'text-slate-300'}`}>
                      {s === 1 ? 'Aparelho' : s === 2 ? 'Problema' : 'Resultado'}
                    </span>
                    {s < 3 && (
                      <div className={`absolute h-[2px] w-[calc(100%-2rem)] top-4.5 left-[calc(50%+1rem)] -z-0 ${step > s ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <i className="fa-solid fa-brain text-blue-600 text-4xl"></i>
                </div>
                <h2 className="text-xl font-black text-slate-800 mb-2">Analisando problema...</h2>
                <p className="text-slate-500 px-8 text-sm leading-relaxed">Nossa IA está cruzando dados técnicos para encontrar as causas mais prováveis.</p>
              </div>
            )}

            {!isLoading && (
              <div className="page-transition">
                {step === 1 && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-black text-slate-800 mb-1">O que quebrou?</h2>
                      <p className="text-slate-500 text-sm">Toque no aparelho que precisa de ajuda.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {APPLIANCES.map((app) => (
                        <ApplianceCard 
                          key={app.id}
                          appliance={app}
                          isSelected={selectedAppliance === app.id}
                          onClick={() => {
                            setSelectedAppliance(app.id);
                            setTimeout(() => setStep(2), 200);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-black text-slate-800 mb-1">Qual o defeito?</h2>
                      <p className="text-slate-500 text-sm">Selecione uma opção ou descreva o problema abaixo.</p>
                    </div>
                    
                    <div className="space-y-2 mb-8">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Opções sugeridas para {currentApplianceLabel}</p>
                      
                      {availableProblems.map((prob) => (
                        <ProblemItem 
                          key={prob.id}
                          problem={prob}
                          isSelected={selectedProblem === prob.id && !customProblem}
                          onClick={() => {
                            setSelectedProblem(prob.id);
                            setCustomProblem('');
                          }}
                        />
                      ))}
                    </div>

                    <div className="relative mb-6">
                      <div className="flex items-center gap-2 mb-5">
                        <div className="h-px flex-1 bg-slate-200"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Ou detalhe com suas palavras</span>
                        <div className="h-px flex-1 bg-slate-200"></div>
                      </div>
                      
                      <div className={`relative group transition-all duration-300 rounded-2xl border-2 ${customProblem.length > 0 ? 'border-blue-400 bg-blue-50/20' : 'border-slate-100 bg-white'} focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50 focus-within:bg-white overflow-hidden shadow-sm`}>
                        <textarea
                          value={customProblem}
                          onChange={(e) => {
                            setCustomProblem(e.target.value);
                            setSelectedProblem(null);
                          }}
                          placeholder={`Ex: O ${currentApplianceLabel} liga, mas desliga sozinho após 2 minutos...`}
                          className="w-full pt-4 pb-12 px-5 bg-transparent outline-none min-h-[140px] text-slate-700 placeholder:text-slate-300 text-base leading-relaxed resize-none"
                        ></textarea>
                      </div>
                    </div>

                    <div className="sticky bottom-4 pt-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
                      <button
                        disabled={!selectedProblem && customProblem.trim().length < 5}
                        onClick={handleNextStep}
                        className="w-full py-4.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black rounded-2xl shadow-xl shadow-blue-200 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                      >
                        {customProblem.trim().length >= 5 ? (
                          <><i className="fa-solid fa-wand-magic-sparkles"></i> Analisar com IA</>
                        ) : (
                          <><i className="fa-solid fa-check"></i> Ver Diagnóstico</>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && diagnosis && selectedAppliance && (
                  <DiagnosisView 
                    diagnosis={diagnosis} 
                    appliance={selectedAppliance} 
                    problem={(customProblem || selectedProblem) as any}
                    onReset={handleReset} 
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating ChatBot */}
      {mode === 'user' && <ChatBot />}

      {/* Trust Footer */}
      {!isLoading && (
        <footer className="max-w-xl mx-auto mt-8 mb-4 px-4 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[10px] font-bold text-slate-400 border border-slate-100 shadow-sm">
              <i className="fa-solid fa-lock text-green-500"></i>
              AMBIENTE SEGURO • SEM DADOS PESSOAIS
            </div>
            
            {mode === 'user' && (
              <div>
                <button 
                  onClick={() => setMode('technician')}
                  className="text-slate-400 text-xs font-bold hover:text-blue-600 transition-colors"
                >
                  Trabalha com consertos? <span className="underline">Cadastre seu serviço</span>
                </button>
              </div>
            )}
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
