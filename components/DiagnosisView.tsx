
import React, { useState, useEffect } from 'react';
import { Diagnosis, ApplianceType, ProblemType, Technician, SavedDiagnosis } from '../types';
import { getDetailedAIDiagnosis } from '../services/geminiService';

interface Props {
  diagnosis: Diagnosis;
  appliance: ApplianceType;
  problem: ProblemType;
  onReset: () => void;
}

const LOADING_MESSAGES = [
  "Iniciando análise técnica avançada...",
  "Consultando padrões de falha conhecidos para este modelo...",
  "Cruzando dados com manuais de serviço e bases técnicas...",
  "Estimando custos atuais de componentes no mercado...",
  "Verificando protocolos de segurança e riscos elétricos...",
  "Processando recomendações preventivas personalizadas...",
  "Formatando seu relatório de diagnóstico detalhado...",
  "Finalizando análise. Quase pronto!"
];

const MOCK_TECHS: Technician[] = [
  { id: '1', name: 'Carlos Manutenção', phone: '11999998888', city: 'são paulo', specialties: ['lavadora', 'geladeira'], isVerified: true, status: 'approved', createdAt: Date.now() },
  { id: '2', name: 'Ana Ar-Condicionado', phone: '21988887777', city: 'rio de janeiro', specialties: ['ar-condicionado'], isVerified: true, status: 'approved', createdAt: Date.now() },
];

export const DiagnosisView: React.FC<Props> = ({ diagnosis, appliance, problem, onReset }) => {
  const [aiData, setAiData] = useState<any>(diagnosis.detailedAI || null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  
  const [userCity, setUserCity] = useState('');
  const [filteredTechs, setFilteredTechs] = useState<Technician[]>([]);
  const [hasSearchedTechs, setHasSearchedTechs] = useState(false);
  const [onlySpecialists, setOnlySpecialists] = useState(true);

  useEffect(() => {
    let interval: number;
    let progressInterval: number;

    if (loadingAi) {
      interval = window.setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);

      progressInterval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 2;
        });
      }, 150);
    } else {
      setProgress(0);
    }

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [loadingAi]);

  const handleDetailedDiagnosis = async () => {
    setLoadingAi(true);
    setMessageIndex(0);
    setProgress(0);
    
    try {
      const data = await getDetailedAIDiagnosis(appliance, problem as string);
      setAiData(data);
    } catch (error) {
      console.error("Failed to fetch detailed diagnosis", error);
    } finally {
      setLoadingAi(false);
    }
  };

  const saveToHistory = () => {
    const history: SavedDiagnosis[] = JSON.parse(localStorage.getItem('diagnosis_history') || '[]');
    
    const newEntry: SavedDiagnosis = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      appliance,
      problem: typeof problem === 'string' ? problem : 'Personalizado',
      diagnosis: {
        ...diagnosis,
        detailedAI: aiData
      }
    };

    localStorage.setItem('diagnosis_history', JSON.stringify([newEntry, ...history]));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const findTechnicians = () => {
    if (!userCity) return;
    const stored = JSON.parse(localStorage.getItem('technicians') || '[]');
    const allTechs = [...MOCK_TECHS, ...stored];
    const matched = allTechs.filter(t => {
      const isApproved = t.status === 'approved';
      const cityMatch = t.city.toLowerCase().includes(userCity.toLowerCase());
      const specialtyMatch = !onlySpecialists || t.specialties.includes(appliance);
      return isApproved && cityMatch && specialtyMatch;
    });
    setFilteredTechs(matched);
    setHasSearchedTechs(true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-slate-100">
        <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <i className="fa-solid fa-magnifying-glass-chart"></i>
              Diagnóstico Estimado
            </h2>
            <p className="text-blue-100 text-sm mt-1 capitalize font-medium">
              {appliance.replace('-', ' ')} • {typeof problem === 'string' ? problem.replace('-', ' ') : 'Problema personalizado'}
            </p>
          </div>
          <button 
            onClick={saveToHistory}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
            title="Salvar no Histórico"
          >
            <i className={`fa-solid ${isSaved ? 'fa-check' : 'fa-bookmark'}`}></i>
          </button>
        </div>

        <div className="p-6 md:p-8">
          <section className="mb-8">
            <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-list-check"></i> Possíveis causas comuns
            </h3>
            <div className="space-y-4">
              {diagnosis.causes.map((cause, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-700 font-medium group-hover:text-blue-600 transition-colors">{cause.description}</span>
                    <span className="text-blue-600 font-bold">{cause.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${cause.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1">
                <i className="fa-solid fa-coins"></i> Custo Médio
              </h3>
              <p className="text-2xl font-bold text-slate-800">{diagnosis.costRange}</p>
              <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                Complexidade: <span className={`font-semibold ${diagnosis.costLevel === 'Baixo' ? 'text-green-600' : diagnosis.costLevel === 'Médio' ? 'text-orange-500' : 'text-red-500'}`}>{diagnosis.costLevel}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
              <h3 className="text-xs uppercase tracking-wider text-blue-400 font-bold mb-2 flex items-center gap-1">
                <i className="fa-solid fa-lightbulb"></i> Dica Prática
              </h3>
              <p className="text-slate-700 italic leading-relaxed font-medium">"{diagnosis.tip}"</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fa-solid fa-triangle-exclamation text-yellow-500"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800 leading-relaxed">
                  <strong>Aviso de Segurança:</strong> Manusear eletrodomésticos sem treinamento oferece riscos graves. Recomendamos sempre um profissional.
                </p>
              </div>
            </div>
          </div>

          {/* AI Detailed Section */}
          {aiData ? (
            <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 mb-8 animate-in zoom-in-95 duration-500 shadow-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <i className="fa-solid fa-robot text-6xl"></i>
              </div>
              <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-3 text-lg">
                <i className="fa-solid fa-wand-magic-sparkles"></i> Análise de Inteligência Artificial
              </h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 mb-6 leading-relaxed text-base">{aiData.detailedExplanation}</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Componentes sob suspeita</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-400">
                    {aiData.additionalCauses.map((c: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                        <i className="fa-solid fa-microchip text-blue-500/50 text-xs"></i>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : loadingAi ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-8 mb-8 text-center transition-all">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-25"></div>
                <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100">
                  <i className="fa-solid fa-microchip text-blue-600 text-3xl animate-pulse"></i>
                </div>
              </div>
              <h3 className="text-slate-800 font-bold text-lg mb-2">Processando Análise</h3>
              <p className="text-blue-600 font-medium text-xs h-8 flex items-center justify-center">
                {LOADING_MESSAGES[messageIndex]}
              </p>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-4 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleDetailedDiagnosis}
              className="w-full mb-8 py-5 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-95 shadow-xl shadow-slate-200"
            >
              <i className="fa-solid fa-wand-magic-sparkles text-blue-400"></i>
              Diagnóstico Detalhado (IA)
            </button>
          )}

          {/* Find Technicians Section */}
          <section className="mb-10 bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
             <h3 className="text-slate-800 font-black mb-4 flex items-center gap-2">
                <i className="fa-solid fa-user-gear text-blue-600"></i>
                Precisa de um Técnico?
             </h3>
             
             <div className="space-y-4">
               {!hasSearchedTechs ? (
                 <div className="space-y-3">
                   <p className="text-slate-500 text-sm mb-4">Busque profissionais na sua região.</p>
                   <div className="flex gap-2">
                     <input 
                      type="text" 
                      value={userCity}
                      onChange={(e) => setUserCity(e.target.value)}
                      placeholder="Ex: São Paulo"
                      className="flex-1 p-3.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                     />
                     <button 
                      onClick={findTechnicians}
                      disabled={!userCity.trim()}
                      className="bg-blue-600 text-white px-6 font-bold rounded-xl active:scale-95 transition-all text-sm disabled:opacity-50"
                     >
                       Buscar
                     </button>
                   </div>
                 </div>
               ) : (
                 <div className="animate-in fade-in duration-300">
                   <div className="flex flex-col gap-3 mb-6">
                      <div className="flex items-center justify-between">
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Profissionais em {userCity}</p>
                         <button onClick={() => setHasSearchedTechs(false)} className="text-xs text-blue-600 font-bold">Alterar Local</button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-filter text-blue-600 text-xs"></i>
                          <span className="text-xs font-bold text-slate-600">Apenas especialistas em {appliance}</span>
                        </div>
                        <button 
                          onClick={() => setOnlySpecialists(!onlySpecialists)}
                          className={`w-10 h-5 rounded-full transition-all relative ${onlySpecialists ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${onlySpecialists ? 'left-6' : 'left-1'}`}></div>
                        </button>
                      </div>
                   </div>
                   
                   {filteredTechs.length > 0 ? (
                     <div className="space-y-3">
                       {filteredTechs.map(tech => (
                         <div key={tech.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                           <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800">{tech.name}</span>
                                {tech.isVerified && <i className="fa-solid fa-circle-check text-blue-500 text-[10px]" title="Verificado"></i>}
                              </div>
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mt-1">
                                {tech.specialties.includes(appliance) ? '✨ Especialista' : 'Geral'} • {tech.specialties.join(', ')}
                              </p>
                              
                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-slate-600">{tech.phone}</span>
                                <a 
                                  href={`tel:${tech.phone}`}
                                  className="w-6 h-6 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-all text-[10px]"
                                >
                                  <i className="fa-solid fa-phone"></i>
                                </a>
                                <a 
                                  href={`https://wa.me/${tech.phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-6 h-6 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all text-[10px]"
                                >
                                  <i className="fa-brands fa-whatsapp"></i>
                                </a>
                              </div>
                           </div>
                           <a 
                            href={`tel:${tech.phone}`}
                            className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-green-100 shrink-0"
                           >
                             <i className="fa-solid fa-phone text-lg"></i>
                           </a>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="text-center py-8 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                       <i className="fa-solid fa-user-slash text-slate-300 text-3xl mb-3"></i>
                       <p className="text-slate-500 text-sm px-6">
                         {onlySpecialists 
                            ? "Não encontramos especialistas neste aparelho na sua cidade." 
                            : "Nenhum técnico disponível nesta região ainda."}
                       </p>
                       {onlySpecialists && (
                         <button 
                            onClick={() => setOnlySpecialists(false)}
                            className="mt-4 text-blue-600 font-bold text-xs underline"
                         >
                           Ver todos os técnicos na região
                         </button>
                       )}
                     </div>
                   )}
                 </div>
               )}
             </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onReset}
              className="flex-1 py-4.5 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 active:scale-95 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-rotate-left"></i>
              Novo Diagnóstico
            </button>
            <button 
              onClick={() => {
                const text = `🔍 Diagnóstico de Eletrodomésticos\n\nEquipamento: ${appliance}\nCusto médio: ${diagnosis.costRange}`;
                navigator.clipboard.writeText(text);
                alert('Copiado para o WhatsApp!');
              }}
              className="flex-1 py-4.5 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-2xl active:scale-95 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-share-nodes text-blue-500"></i> Compartilhar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
