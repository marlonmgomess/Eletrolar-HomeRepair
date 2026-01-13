
import React, { useState, useEffect, useRef } from 'react';
import { Technician, ApplianceType } from '../types';
import { APPLIANCES } from '../constants';

interface Props {
  onClose: () => void;
}

export const TechnicianPortal: React.FC<Props> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'list' | 'settings'>('register');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Admin Management States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  
  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [paymentProof, setPaymentProof] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<ApplianceType[]>([]);
  
  // App States
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [systemFee, setSystemFee] = useState('49.90');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ADMIN_EMAIL = "marlonmgomessd@gmail.com";
  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    const storedTechs = JSON.parse(localStorage.getItem('technicians') || '[]');
    const storedFee = localStorage.getItem('system_fee') || '49.90';
    setTechnicians(storedTechs);
    setSystemFee(storedFee);
  }, [activeTab]);

  const handleTabChange = (tab: 'register' | 'list' | 'settings') => {
    if (tab === 'list' || tab === 'settings') {
      if (!isAdminAuthenticated) {
        const pass = prompt("Senha de administrador:");
        if (pass === ADMIN_PASSWORD) {
          setIsAdminAuthenticated(true);
          setActiveTab(tab);
        } else {
          alert("Acesso negado.");
        }
        return;
      }
    }
    setActiveTab(tab);
  };

  const handleApproveTechnician = (id: string) => {
    const updated = technicians.map(t => 
      t.id === id ? { ...t, status: 'approved' as const, isVerified: true } : t
    );
    localStorage.setItem('technicians', JSON.stringify(updated));
    setTechnicians(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("O arquivo é muito grande (Máx 2MB).");
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setPaymentProof(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const openProof = (base64: string) => {
    const newWindow = window.open();
    if (!newWindow) return;
    if (base64.includes('pdf')) {
      newWindow.document.write(`<iframe src="${base64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
    } else {
      newWindow.document.write(`<img src="${base64}" style="max-width: 100%; height: auto; display: block; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação estrita do telefone (apenas dígitos)
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (!name.trim()) {
      alert("Por favor, preencha o nome completo.");
      return;
    }
    
    // Validação de comprimento: DDD (2) + Número (8 ou 9) = 10 ou 11 dígitos
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      alert("Número de WhatsApp inválido. Insira o DDD + Número (Ex: 11988887777). Certifique-se de que o número contém apenas dígitos.");
      return;
    }

    if (!city.trim()) {
      alert("Por favor, informe sua cidade de atuação.");
      return;
    }

    if (!paymentProof) {
      alert("Por favor, anexe o comprovante de pagamento da taxa.");
      return;
    }

    if (selectedSpecialties.length === 0) {
      alert("Selecione ao menos uma especialidade.");
      return;
    }

    const newTech: Technician = {
      id: Date.now().toString(),
      name: name.trim(),
      phone: cleanPhone,
      city: city.trim().toLowerCase(),
      specialties: selectedSpecialties,
      isVerified: false,
      status: 'pending',
      paymentProof,
      createdAt: Date.now()
    };

    const existing = JSON.parse(localStorage.getItem('technicians') || '[]');
    localStorage.setItem('technicians', JSON.stringify([...existing, newTech]));

    // Dispara e-mail
    const subject = encodeURIComponent(`Solicitação de Cadastro: ${name} (${city})`);
    const body = encodeURIComponent(
      `Novo técnico aguardando aprovação:\n\n` +
      `Nome: ${name}\n` +
      `WhatsApp: ${cleanPhone}\n` +
      `Cidade: ${city}\n` +
      `Especialidades: ${selectedSpecialties.join(', ')}\n\n` +
      `Verifique o comprovante no painel do app.`
    );
    window.location.href = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;

    setShowSuccessMessage(true);
    
    // Reset form fields
    setName(''); setPhone(''); setCity(''); setPaymentProof(''); setFileName(''); setSelectedSpecialties([]);
  };

  const filteredTechs = technicians.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: technicians.length,
    pending: technicians.filter(t => t.status === 'pending').length,
    approved: technicians.filter(t => t.status === 'approved').length
  };

  if (showSuccessMessage) {
    return (
      <div className="py-16 px-4 text-center animate-in zoom-in-95 duration-500 max-w-sm mx-auto">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-green-200 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto relative shadow-xl shadow-green-100">
            <i className="fa-solid fa-check text-4xl"></i>
          </div>
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-4 leading-tight">Cadastro Enviado!</h2>
        
        <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-50 shadow-sm mb-8">
          <p className="text-slate-600 font-medium leading-relaxed mb-4">
            Sua solicitação de parceiro já está em nosso sistema e <span className="text-blue-600 font-bold">em fase de revisão</span>.
          </p>
          <div className="flex items-center justify-center gap-3 text-amber-600 bg-amber-50 py-3 px-4 rounded-2xl border border-amber-100">
            <i className="fa-solid fa-clock-rotate-left"></i>
            <span className="text-xs font-black uppercase tracking-widest">Prazo: Até 3 dias úteis</span>
          </div>
        </div>

        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Nossa equipe analisará seu comprovante e as especialidades selecionadas antes de liberar seu perfil para os clientes.
        </p>

        <button 
          onClick={onClose} 
          className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-house"></i>
          Voltar para a Home
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-500 pb-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 leading-tight">
            {activeTab === 'register' ? 'Seja um Parceiro' : 'Painel de Controle'}
          </h2>
          <p className="text-slate-500 text-sm">
            {activeTab === 'register' ? 'Ganhe mais clientes na sua região.' : 'Administração de solicitações.'}
          </p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
          <i className="fa-solid fa-circle-xmark text-2xl"></i>
        </button>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => handleTabChange('register')}
          className={`flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'register' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
        >
          Cadastro
        </button>
        <button 
          onClick={() => handleTabChange('list')}
          className={`flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
        >
          Gestão {isAdminAuthenticated ? `(${stats.pending})` : '🔒'}
        </button>
        <button 
          onClick={() => handleTabChange('settings')}
          className={`flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
        >
          Configurações {isAdminAuthenticated ? '' : '🔒'}
        </button>
      </div>

      {activeTab === 'register' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-100">
            <h3 className="font-black uppercase text-[10px] tracking-widest mb-1 opacity-80">Taxa Única de Cadastro</h3>
            <p className="text-3xl font-black">R$ {systemFee}</p>
            <p className="text-xs mt-2 opacity-90 leading-relaxed">
              PIX para: <strong>{ADMIN_EMAIL}</strong><br/>
              Anexe o comprovante abaixo para nossa equipe aprovar seu perfil.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Dados Pessoais</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 font-medium mb-3" 
                  placeholder="Nome Completo *" 
                />
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 font-medium" 
                  placeholder="WhatsApp (DDD + Número) *" 
                />
                <p className="text-[9px] text-slate-400 mt-1 ml-1 font-bold">Apenas números, Ex: 11999998888</p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Localização</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 font-medium" 
                  placeholder="Sua Cidade de Atuação (Ex: São Paulo) *" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pagamento</label>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className={`w-full p-6 border-2 border-dashed rounded-3xl flex flex-col items-center gap-2 ${paymentProof ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50'}`}>
                  <i className={`fa-solid ${paymentProof ? 'fa-check-circle text-green-500' : 'fa-cloud-arrow-up text-slate-400'} text-2xl`}></i>
                  <span className="text-xs font-bold text-slate-500">{fileName || 'Anexar Comprovante *'}</span>
                </button>
              </div>
            </div>

            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Especialidades</p>
            <div className="grid grid-cols-2 gap-2">
              {APPLIANCES.map(app => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => setSelectedSpecialties(prev => prev.includes(app.id) ? prev.filter(s => s !== app.id) : [...prev, app.id])}
                  className={`p-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                    selectedSpecialties.includes(app.id) ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-white bg-white text-slate-400'
                  }`}
                >
                  <i className={`fa-solid ${app.icon}`}></i>
                  {app.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
            Enviar Cadastro para Marlon
          </button>
        </form>
      ) : activeTab === 'list' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase">Total</p>
              <p className="text-xl font-black text-slate-800">{stats.total}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
              <p className="text-[8px] font-black text-orange-400 uppercase">Pendentes</p>
              <p className="text-xl font-black text-orange-600">{stats.pending}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100 text-center">
              <p className="text-[8px] font-black text-green-400 uppercase">Aprovados</p>
              <p className="text-xl font-black text-green-600">{stats.approved}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome ou cidade..."
                className="w-full p-4 pl-12 bg-white border border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-medium text-sm"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'pending', 'approved'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    statusFilter === f ? 'bg-slate-800 text-white' : 'bg-white text-slate-400 border border-slate-100'
                  }`}
                >
                  {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendentes' : 'Aprovados'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredTechs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <i className="fa-solid fa-folder-open text-slate-200 text-4xl mb-3"></i>
                <p className="text-slate-400 font-bold">Nenhum registro encontrado.</p>
              </div>
            ) : (
              filteredTechs.sort((a,b) => b.createdAt - a.createdAt).map(tech => (
                <div key={tech.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                        tech.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {tech.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800">{tech.name}</h4>
                          {tech.isVerified && <i className="fa-solid fa-circle-check text-blue-500 text-xs"></i>}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          {tech.city} • <span className="text-blue-500">{tech.phone}</span>
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      tech.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {tech.status}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {tech.specialties.map(s => (
                      <span key={s} className="px-2 py-1 bg-slate-50 text-slate-400 rounded-md text-[8px] font-bold uppercase border border-slate-100">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {tech.paymentProof && (
                      <button 
                        onClick={() => openProof(tech.paymentProof!)}
                        className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 flex items-center justify-center gap-2"
                      >
                        <i className="fa-solid fa-receipt"></i>
                        Ver Comprovante
                      </button>
                    )}
                    
                    {tech.status === 'pending' && (
                      <button 
                        onClick={() => handleApproveTechnician(tech.id)}
                        className="flex-1 py-3 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100 active:scale-95 transition-all"
                      >
                        Aprovar
                      </button>
                    )}
                    
                    <button 
                      onClick={() => {
                        if(confirm("Deseja deletar este cadastro permanentemente?")) {
                          const updated = technicians.filter(t => t.id !== tech.id);
                          localStorage.setItem('technicians', JSON.stringify(updated));
                          setTechnicians(updated);
                        }
                      }}
                      className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : activeTab === 'settings' ? (
        <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm animate-in fade-in">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-gears text-blue-600"></i>
            Configurações Globais
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Taxa de Cadastro (Exibida para Técnicos)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">R$</span>
                <input 
                  type="number" 
                  value={systemFee}
                  onChange={(e) => setSystemFee(e.target.value)}
                  className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 text-xl font-black"
                />
              </div>
            </div>
            <button 
              onClick={() => { localStorage.setItem('system_fee', systemFee); alert("Taxa atualizada!"); }}
              className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-50 hover:bg-blue-700 transition-all"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
