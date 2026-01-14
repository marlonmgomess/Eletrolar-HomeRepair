
import { Appliance, Problem, Diagnosis, ApplianceType } from './types';

export const APPLIANCES: Appliance[] = [
  { id: 'lavadora', label: 'Lavadora', icon: 'fa-soap', color: 'bg-blue-500' },
  { id: 'geladeira', label: 'Geladeira', icon: 'fa-refrigerator', color: 'bg-cyan-500' },
  { id: 'freezer', label: 'Freezer', icon: 'fa-box-open', color: 'bg-indigo-500' },
  { id: 'fogao', label: 'Fogão', icon: 'fa-fire', color: 'bg-orange-600' },
  { id: 'ar-condicionado', label: 'Ar-condicionado', icon: 'fa-wind', color: 'bg-sky-500' },
  { id: 'secadora', label: 'Secadora', icon: 'fa-shirt', color: 'bg-blue-400' },
  { id: 'centrifuga-tanquinho', label: 'Tanquinho', icon: 'fa-water', color: 'bg-teal-500' },
  { id: 'air-fryer', label: 'Air Fryer', icon: 'fa-fan', color: 'bg-orange-500' },
  { id: 'microondas', label: 'Microondas', icon: 'fa-wave-square', color: 'bg-purple-500' },
  { id: 'forno-eletrico', label: 'Forno Elétrico', icon: 'fa-fire-burner', color: 'bg-red-500' },
];

export const GENERIC_PROBLEMS: Problem[] = [
  { id: 'nao-liga', label: 'Não liga / Morto', icon: 'fa-power-off' },
  { id: 'faz-barulho', label: 'Barulho estranho', icon: 'fa-volume-high' },
  { id: 'painel-nao-responde', label: 'Painel travado/não responde', icon: 'fa-keyboard' },
];

export const SPECIFIC_PROBLEMS: Record<ApplianceType, Problem[]> = {
  'lavadora': [
    { id: 'nao-centrifuga', label: 'Não centrifuga', icon: 'fa-rotate' },
    { id: 'nao-solta-agua', label: 'Não joga água fora', icon: 'fa-droplet-slash' },
    { id: 'vazamento-agua', label: 'Vazando água por baixo', icon: 'fa-faucet-drip' },
    { id: 'balanca-muito', label: 'Balança/Pula muito', icon: 'fa-arrows-left-right' },
  ],
  'geladeira': [
    { id: 'nao-gela-embaixo', label: 'Gela em cima, mas não embaixo', icon: 'fa-temperature-arrow-down' },
    { id: 'vazando-agua-dentro', label: 'Vazando água dentro (gavetas)', icon: 'fa-droplet' },
    { id: 'formando-gelo', label: 'Formando gelo em excesso', icon: 'fa-icicles' },
    { id: 'estalos-fortes', label: 'Estalos fortes constantes', icon: 'fa-bolt-lightning' },
  ],
  'freezer': [
    { id: 'nao-gela-esquenta', label: 'Não está congelando', icon: 'fa-snowflake' },
    { id: 'alarme-apitando', label: 'Alarme de temperatura apitando', icon: 'fa-bell' },
    { id: 'formando-gelo', label: 'Excesso de gelo na tampa', icon: 'fa-icicles' },
    { id: 'motor-nao-para', label: 'Motor funciona sem parar', icon: 'fa-infinity' },
  ],
  'fogao': [
    { id: 'chama-amarela', label: 'Chama amarela / Sujando panela', icon: 'fa-fire' },
    { id: 'boca-nao-acende', label: 'Boca não acende (faísca ok)', icon: 'fa-xmark' },
    { id: 'cheiro-gas', label: 'Cheiro de gás constante', icon: 'fa-biohazard' },
    { id: 'luz-queimada', label: 'Luz do forno não acende', icon: 'fa-lightbulb' },
  ],
  'secadora': [
    { id: 'nao-esquenta', label: 'Gira mas não esquenta', icon: 'fa-temperature-low' },
    { id: 'tambor-travado', label: 'Tambor não gira', icon: 'fa-circle-stop' },
    { id: 'nao-seca-roupa', label: 'Demora muito para secar', icon: 'fa-clock' },
    { id: 'cheiro-ruim', label: 'Cheiro de queimado', icon: 'fa-fire' },
  ],
  'centrifuga-tanquinho': [
    { id: 'nao-centrifuga', label: 'Batedor não gira', icon: 'fa-spinner' },
    { id: 'vazamento-tanque', label: 'Vazando água pela base', icon: 'fa-faucet-drip' },
    { id: 'timer-travado', label: 'Timer não volta sozinho', icon: 'fa-clock' },
    { id: 'faz-barulho', label: 'Barulho de metal batendo', icon: 'fa-hammer' },
  ],
  'ar-condicionado': [
    { id: 'pingando-dentro', label: 'Pingando água dentro de casa', icon: 'fa-droplet' },
    { id: 'cheiro-ruim', label: 'Cheiro de mofo ou queimado', icon: 'fa-nose-smell' },
    { id: 'nao-gela-esquenta', label: 'Não gela o ambiente', icon: 'fa-snowflake' },
    { id: 'desliga-sozinho', label: 'Desliga sozinho após minutos', icon: 'fa-stopwatch' },
  ],
  'air-fryer': [
    { id: 'nao-esquenta', label: 'Liga mas não esquenta', icon: 'fa-fire-dash' },
    { id: 'timer-travado', label: 'Timer não gira/não para', icon: 'fa-clock' },
    { id: 'fumaça-muita', label: 'Fumaça branca em excesso', icon: 'fa-smog' },
  ],
  'microondas': [
    { id: 'prato-nao-gira', label: 'Prato não gira', icon: 'fa-rotate-right' },
    { id: 'soltando-faisca', label: 'Soltando faíscas dentro', icon: 'fa-bolt' },
    { id: 'nao-aquece', label: 'Funciona mas não aquece', icon: 'fa-hot-tub-person' },
  ],
  'forno-eletrico': [
    { id: 'assando-desigual', label: 'Assa mais de um lado', icon: 'fa-chart-pie' },
    { id: 'porta-nao-fecha', label: 'Porta não fecha direito', icon: 'fa-door-closed' },
    { id: 'luz-queimada', label: 'Luz interna não acende', icon: 'fa-lightbulb' },
  ]
};

export const BASE_DIAGNOSES: Record<string, Diagnosis> = {
  // FOGÃO
  'fogao-chama-amarela': {
    causes: [
      { description: 'Sujeira nos queimadores (gordura)', percentage: 60 },
      { description: 'Gás de má qualidade ou fim do botijão', percentage: 25 },
      { description: 'Entrada de ar primário desregulada', percentage: 15 }
    ],
    costLevel: 'Baixo', costRange: 'R$ 30 a R$ 120',
    tip: 'Limpe as bocas com agulha própria e certifique-se de que estão bem secas.'
  },
  'fogao-cheiro-gas': {
    causes: [
      { description: 'Vazamento na mangueira ou registro', percentage: 50 },
      { description: 'Abraçadeiras frouxas', percentage: 30 },
      { description: 'Vazamento interno nos ramais', percentage: 20 }
    ],
    costLevel: 'Médio', costRange: 'R$ 50 a R$ 250',
    tip: 'Use espuma de sabão para testar a mangueira. Se houver bolhas, troque-a imediatamente.'
  },

  // FREEZER
  'freezer-alarme-apitando': {
    causes: [
      { description: 'Porta mal fechada ou borracha gasta', percentage: 50 },
      { description: 'Falta de gás por micro-furo', percentage: 30 },
      { description: 'Placa eletrônica enviando sinal falso', percentage: 20 }
    ],
    costLevel: 'Médio', costRange: 'R$ 150 a R$ 700',
    tip: 'Verifique se não há excesso de alimentos obstruindo o fechamento total da porta.'
  },

  // SECADORA
  'secadora-nao-esquenta': {
    causes: [
      { description: 'Resistência de aquecimento queimada', percentage: 55 },
      { description: 'Termostato de segurança (Klicson) aberto', percentage: 35 },
      { description: 'Placa lógica não envia comando', percentage: 10 }
    ],
    costLevel: 'Médio', costRange: 'R$ 180 a R$ 550',
    tip: 'Limpe o filtro de fiapos; o superaquecimento por falta de fluxo de ar queima a resistência.'
  },

  // TANQUINHO
  'centrifuga-tanquinho-vazamento-tanque': {
    causes: [
      { description: 'Cubo/Bucha central desgastada', percentage: 70 },
      { description: 'Mangueira de drenagem furada', percentage: 20 },
      { description: 'Tanque plástico rachado', percentage: 10 }
    ],
    costLevel: 'Baixo', costRange: 'R$ 60 a R$ 180',
    tip: 'Não deixe água parada no tanquinho por dias; o sabão corrói a vedação do eixo.'
  },

  // LAVADORA
  'lavadora-nao-liga': {
    causes: [
      { description: 'Problema na tomada ou disjuntor', percentage: 45 },
      { description: 'Cabo de força danificado', percentage: 25 },
      { description: 'Placa eletrônica principal queimada', percentage: 20 },
      { description: 'Microchave da tampa com defeito', percentage: 10 }
    ],
    costLevel: 'Baixo', costRange: 'R$ 80 a R$ 450',
    tip: 'Teste a tomada com um secador de cabelo ou carregador de celular primeiro.'
  },
  'lavadora-nao-centrifuga': {
    causes: [
      { description: 'Atuador de freio com defeito', percentage: 40 },
      { description: 'Capacitor do motor esgotado', percentage: 30 },
      { description: 'Eixo ou rolamentos travados', percentage: 20 },
      { description: 'Sensor de balanceamento ativado', percentage: 10 }
    ],
    costLevel: 'Médio', costRange: 'R$ 150 a R$ 550',
    tip: 'Verifique se a roupa não está acumulada apenas de um lado do cesto.'
  },
  'lavadora-nao-solta-agua': {
    causes: [
      { description: 'Eletrobomba de drenagem queimada', percentage: 60 },
      { description: 'Objeto travando a hélice da bomba', percentage: 25 },
      { description: 'Mangueira de saída dobrada ou entupida', percentage: 15 }
    ],
    costLevel: 'Baixo', costRange: 'R$ 120 a R$ 280',
    tip: 'Limpe o filtro de detritos que fica na parte inferior (se o modelo possuir).'
  },

  // GELADEIRA
  'geladeira-nao-gela-embaixo': {
    causes: [
      { description: 'Bloqueio de gelo no duto de ar', percentage: 50 },
      { description: 'Motor do ventilador (froz-free) parado', percentage: 25 },
      { description: 'Resistência de degelo queimada', percentage: 15 },
      { description: 'Sensor de temperatura descalibrado', percentage: 10 }
    ],
    costLevel: 'Médio', costRange: 'R$ 180 a R$ 600',
    tip: 'Desligue da tomada por 24h com as portas abertas. Se voltar a gelar, o problema é no sistema de degelo.'
  },
  'geladeira-vazando-agua-dentro': {
    causes: [
      { description: 'Dreno de degelo entupido', percentage: 80 },
      { description: 'Calha de escoamento desalinhada', percentage: 15 },
      { description: 'Vedação da porta (borracha) gasta', percentage: 5 }
    ],
    costLevel: 'Baixo', costRange: 'R$ 50 a R$ 150',
    tip: 'Tente passar um arame flexível ou canudo no furo do dreno atrás das gavetas de legumes.'
  },

  // AR CONDICIONADO
  'ar-condicionado-pingando-dentro': {
    causes: [
      { description: 'Dreno obstruído por sujeira/lodo', percentage: 70 },
      { description: 'Filtros excessivamente sujos', percentage: 20 },
      { description: 'Instalação sem a inclinação correta', percentage: 10 }
    ],
    costLevel: 'Baixo', costRange: 'R$ 100 a R$ 250',
    tip: 'Uma limpeza profissional (manutenção preventiva) resolve 90% dos casos de vazamento.'
  },
  'ar-condicionado-nao-gela-esquenta': {
    causes: [
      { description: 'Falta de gás (vazamento no sistema)', percentage: 45 },
      { description: 'Capacitor da unidade externa estourado', percentage: 30 },
      { description: 'Compressor não está partindo', percentage: 15 },
      { description: 'Sensores de serpentina com erro', percentage: 10 }
    ],
    costLevel: 'Alto', costRange: 'R$ 250 a R$ 900',
    tip: 'Verifique se a unidade externa (condensadora) está ligando quando você coloca no modo "Cool".'
  },

  // MICROONDAS
  'microondas-nao-aquece': {
    causes: [
      { description: 'Magnetron com defeito (não emite ondas)', percentage: 60 },
      { description: 'Capacitor de alta tensão em curto', percentage: 20 },
      { description: 'Diodo de alta tensão queimado', percentage: 15 },
      { description: 'Relé da placa principal falhando', percentage: 5 }
    ],
    costLevel: 'Médio', costRange: 'R$ 180 a R$ 450',
    tip: 'Cuidado! Mesmo desligado, o microondas retém carga elétrica mortal no capacitor.'
  },
  'microondas-soltando-faisca': {
    causes: [
      { description: 'Placa de mica (guia de ondas) suja/queimada', percentage: 75 },
      { description: 'Pintura interna descascada', percentage: 20 },
      { description: 'Uso de utensílios metálicos', percentage: 5 }
    ],
    costLevel: 'Baixo', costRange: 'R$ 40 a R$ 120',
    tip: 'Troque a placa de mica imediatamente. Se continuar usando, vai queimar o Magnetron.'
  },

  // AIR FRYER
  'air-fryer-nao-esquenta': {
    causes: [
      { description: 'Fusível térmico de segurança aberto', percentage: 65 },
      { description: 'Resistência circular interrompida', percentage: 20 },
      { description: 'Termostato mecânico quebrado', percentage: 15 }
    ],
    costLevel: 'Baixo', costRange: 'R$ 80 a R$ 220',
    tip: 'Evite usar a Air Fryer em tomadas junto com outros aparelhos potentes.'
  },

  'default': {
    causes: [
      { description: 'Falha em componente eletrônico interno', percentage: 50 },
      { description: 'Fiação solta ou mau contato por vibração', percentage: 30 },
      { description: 'Necessidade de higienização técnica', percentage: 20 }
    ],
    costLevel: 'Médio', costRange: 'R$ 150 a R$ 500',
    tip: 'Este sintoma sugere uma falha intermitente. Um técnico deve realizar testes de continuidade.'
  }
};
