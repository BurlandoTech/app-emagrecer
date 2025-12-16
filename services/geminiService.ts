//import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, GeneratedPlan } from '../types';

const getAiClient = () => {
  // Uses the environment variable as per instructions
//   const apiKey = process.env.API_KEY;
//   if (!apiKey) {
//     throw new Error("API Key not found via process.env.API_KEY");
//   }
//   return new GoogleGenAI({ apiKey });
 };

export const generatePlan = async (profile: UserProfile): Promise<GeneratedPlan> => {
  const res = await fetch("/.netlify/functions/generate-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || `Erro HTTP ${res.status}`);
  }

  return JSON.parse(text) as GeneratedPlan;
};

export const sendMessageToCoach = async (
  currentMessage: string, 
  history: { role: 'user' | 'model', text: string }[],
  userContext: GeneratedPlan | null
): Promise<string> => {
  const ai = getAiClient();
  
  const systemInstruction = `
    Você é o 'Coach BodyRecomp', um treinador experiente, motivador, mas direto.
    Seu objetivo é ajudar o usuário a seguir o plano de dieta e treino para recomposição corporal.
    Use o contexto do plano gerado (se disponível) para dar respostas específicas.
    Seja conciso, prático e incentive a disciplina.
    Idioma: Português do Brasil.
  `;

  // Provide the plan context in the first prompt implicitly via history or context injection
  // Here we reconstruct the chat history for the Gemini API
  const contextString = userContext 
    ? `CONTEXTO DO PLANO DO USUÁRIO: Calorias: ${userContext.macros.calories}, Proteína: ${userContext.macros.protein}g. Foco: Hipertrofia e perda de gordura.`
    : "O usuário ainda não gerou um plano.";

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
    history: [
      {
        role: 'user',
        parts: [{ text: `Configuração Inicial. ${contextString}` }]
      },
      {
        role: 'model',
        parts: [{ text: "Entendido, Coach pronto para ajudar. Qual sua dúvida?" }]
      },
      ...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }))
    ]
  });

  const result = await chat.sendMessage({ message: currentMessage });
  return result.text || "Desculpe, não consegui processar sua mensagem. Tente novamente.";
};