
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Diagnosis } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getDiagnosisFromText(appliance: string, text: string): Promise<Diagnosis | null> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `O usuário tem um(a) ${appliance} e descreveu o seguinte problema: "${text}". 
      Gere um diagnóstico estruturado em JSON. 
      Não incentive a abertura do aparelho pelo usuário.
      A moeda deve ser Real (R$).`,
      config: {
        systemInstruction: "Você é um técnico especializado. Gere causas prováveis com porcentagens, uma faixa de custo (Baixo/Médio/Alto e valores em R$) e uma dica prática rápida. Seja direto e profissional.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            causes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  percentage: { type: Type.NUMBER }
                },
                required: ["description", "percentage"]
              }
            },
            costLevel: { type: Type.STRING, enum: ["Baixo", "Médio", "Alto"] },
            costRange: { type: Type.STRING },
            tip: { type: Type.STRING }
          },
          required: ["causes", "costLevel", "costRange", "tip"]
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as Diagnosis;
  } catch (error) {
    console.error("Error generating custom diagnosis:", error);
    return null;
  }
}

export async function getDetailedAIDiagnosis(appliance: string, problem: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `O usuário tem um(a) ${appliance} com o seguinte problema: "${problem}". 
      Forneça um diagnóstico técnico simplificado para leigos. 
      Não incentive a abertura do aparelho pelo usuário.
      Foque em causas prováveis e recomendações de segurança.`,
      config: {
        systemInstruction: "Você é um especialista em manutenção de eletrodomésticos. Use tom amigável, direto e profissional. Evite termos excessivamente técnicos. Priorize segurança sempre.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detailedExplanation: { type: Type.STRING },
            additionalCauses: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            maintenanceTip: { type: Type.STRING }
          },
          required: ["detailedExplanation", "additionalCauses", "maintenanceTip"]
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error fetching AI diagnosis:", error);
    return null;
  }
}

/**
 * Chat interactivo para suporte contínuo
 */
export async function sendChatMessage(messages: {role: 'user' | 'model', text: string}[]) {
  try {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `Você é o 'EletroBot', o assistente inteligente da Eletrolar HomeRepair. 
        Sua missão é ajudar usuários com dúvidas sobre defeitos em eletrodomésticos.
        REGRAS:
        1. Nunca sugira que o usuário abra o aparelho se houver risco de choque (capacitores, microondas, fiação exposta).
        2. Seja empático mas técnico.
        3. Se o usuário perguntar algo fora de eletrodomésticos, gentilmente redirecione para o tema do app.
        4. Use formatação Markdown leve (negrito para nomes de peças).
        5. Incentive a busca por técnicos profissionais aprovados no app se o problema parecer complexo.`,
      }
    });

    // Envia apenas a última mensagem para manter o fluxo se necessário ou usar o histórico do chat
    // Para simplificar, vamos reconstruir o histórico no chat
    const lastMessage = messages[messages.length - 1].text;
    const response = await chat.sendMessage({ message: lastMessage });
    
    return response.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "Desculpe, tive um problema técnico na minha placa lógica. Pode repetir?";
  }
}
