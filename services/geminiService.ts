import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, GeneratedPlan } from '../types';

const getAiClient = () => {
  // Uses the environment variable as per instructions
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found via process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePlan = async (profile: UserProfile): Promise<GeneratedPlan> => {
  const ai = getAiClient();
  
  const prompt = `
    Crie um plano detalhado de recomposição corporal (perda de gordura e ganho de massa magra) para o seguinte perfil:
    - Idade: ${profile.age} anos
    - Peso: ${profile.weight} kg
    - Altura: ${profile.height} cm
    - Gênero: ${profile.gender}
    - Nível de Atividade: ${profile.activityLevel}
    - Objetivo Principal: ${profile.goal}
    - Ambiente de Treino: ${profile.environment}
    - Restrições/Preferências: ${profile.restrictions || 'Nenhuma'}

    O plano deve incluir:
    1. Metas de macronutrientes diárias.
    2. Um plano alimentar de exemplo para um dia.
    3. Um plano de treino de exemplo para um dia (focado em hipertrofia/força).
    
    Responda APENAS com o JSON seguindo o schema fornecido. O idioma deve ser Português do Brasil.
  `;

  const exerciseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      sets: { type: Type.NUMBER },
      reps: { type: Type.STRING },
      notes: { type: Type.STRING }
    },
    required: ["name", "sets", "reps", "notes"]
  };

  const mealItemSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      quantity: { type: Type.STRING },
      calories: { type: Type.NUMBER },
      protein: { type: Type.NUMBER },
      carbs: { type: Type.NUMBER },
      fats: { type: Type.NUMBER }
    },
    required: ["name", "quantity", "calories", "protein", "carbs", "fats"]
  };

  const mealSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Nome da refeição (ex: Café da Manhã)" },
      items: { type: Type.ARRAY, items: mealItemSchema },
      totalCalories: { type: Type.NUMBER }
    },
    required: ["name", "items", "totalCalories"]
  };

  const workoutSessionSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      dayName: { type: Type.STRING, description: "Ex: Treino A - Superiores" },
      focus: { type: Type.STRING },
      warmup: { type: Type.STRING },
      exercises: { type: Type.ARRAY, items: exerciseSchema },
      cardio: { type: Type.STRING }
    },
    required: ["dayName", "focus", "warmup", "exercises", "cardio"]
  };

  const macroSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      protein: { type: Type.NUMBER, description: "Gramas de proteína" },
      carbs: { type: Type.NUMBER, description: "Gramas de carboidrato" },
      fats: { type: Type.NUMBER, description: "Gramas de gordura" },
      calories: { type: Type.NUMBER, description: "Total calórico diário" }
    },
    required: ["protein", "carbs", "fats", "calories"]
  };

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: "Um resumo motivacional curto e estratégia geral." },
      macros: macroSchema,
      nutritionPlan: { type: Type.ARRAY, items: mealSchema },
      workoutPlan: { type: Type.ARRAY, items: workoutSessionSchema }
    },
    required: ["summary", "macros", "nutritionPlan", "workoutPlan"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as GeneratedPlan;

  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
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