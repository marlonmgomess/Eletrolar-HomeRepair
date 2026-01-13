
export type ApplianceType = 
  | 'lavadora' 
  | 'geladeira' 
  | 'ar-condicionado' 
  | 'air-fryer' 
  | 'microondas' 
  | 'forno-eletrico';

export type ProblemType = 
  | 'nao-liga' 
  | 'nao-funciona-corretamente' 
  | 'nao-gela-esquenta' 
  | 'faz-barulho' 
  | 'painel-nao-responde'
  | 'nao-centrifuga'
  | 'nao-solta-agua'
  | 'vazamento-agua'
  | 'balanca-muito'
  | 'nao-gela-embaixo'
  | 'vazando-agua-dentro'
  | 'formando-gelo'
  | 'estalos-fortes'
  | 'pingando-dentro'
  | 'cheiro-ruim'
  | 'desliga-sozinho'
  | 'nao-esquenta'
  | 'timer-travado'
  | 'fumaça-muita'
  | 'prato-nao-gira'
  | 'soltando-faisca'
  | 'nao-aquece'
  | 'assando-desigual'
  | 'porta-nao-fecha'
  | 'luz-queimada';

export interface Cause {
  description: string;
  percentage: number;
}

export interface Diagnosis {
  causes: Cause[];
  costLevel: 'Baixo' | 'Médio' | 'Alto';
  costRange: string;
  tip: string;
  detailedAI?: {
    detailedExplanation: string;
    additionalCauses: string[];
    maintenanceTip: string;
  };
}

export interface SavedDiagnosis {
  id: string;
  timestamp: number;
  appliance: ApplianceType;
  problem: string;
  diagnosis: Diagnosis;
}

export interface Appliance {
  id: ApplianceType;
  label: string;
  icon: string;
  color: string;
}

export interface Problem {
  id: ProblemType;
  label: string;
  icon: string;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  city: string;
  specialties: ApplianceType[];
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  paymentProof?: string;
  createdAt: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
