import { GoogleGenAI, Type } from "@google/genai";

export default async (req) => {
  try {
    // 1) Só aceitamos POST
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // 2) Chave secreta (só existe no servidor do Netlify)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY on Netlify" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3) Dados vindos do frontend
    const profile = await req.json();

    // 4) Prompt (o mesmo conceito que estava no frontend)
    const prompt = `
Crie um plano detalhado de recomposição corporal (perda de gordura e ganho de massa magra) para o seguinte perfil:
- Idade: ${profile.age} anos
- Peso: ${profile.weight} kg
- Altura: ${profile.height} cm
- Gênero: ${profile.gender}
- Nível de Atividade: ${profile.activityLevel}
- Objetivo Principal: ${profile.goal}
- Ambiente de Treino: ${profile.environment}
- Restrições/Preferências: ${profile.restrictions || "Nenhuma"}

O plano deve incluir:
1. Metas de macronutrientes diárias.
2. Um plano alimentar de exemplo para um dia.
3. Um plano de treino de exemplo para um dia (focado em hipertrofia/força).

Responda APENAS com JSON válido. Idioma: Português do Brasil.
`.trim();

    // 5) Schema do JSON (para a IA responder no formato certo)
    const exerciseSchema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        sets: { type: Type.NUMBER },
        reps: { type: Type.STRING },
        notes: { type: Type.STRING },
      },
      required: ["name", "sets", "reps", "notes"],
    };

    const mealItemSchema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        quantity: { type: Type.STRING },
        calories: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        fats: { type: Type.NUMBER },
      },
      required: ["name", "quantity", "calories", "protein", "carbs", "fats"],
    };

    const mealSchema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Nome da refeição (ex: Café da Manhã)" },
        items: { type: Type.ARRAY, items: mealItemSchema },
        totalCalories: { type: Type.NUMBER },
      },
      required: ["name", "items", "totalCalories"],
    };

    const workoutSessionSchema = {
      type: Type.OBJECT,
      properties: {
        dayName: { type: Type.STRING, description: "Ex: Treino A - Superiores" },
        focus: { type: Type.STRING },
        warmup: { type: Type.STRING },
        exercises: { type: Type.ARRAY, items: exerciseSchema },
        cardio: { type: Type.STRING },
      },
      required: ["dayName", "focus", "warmup", "exercises", "cardio"],
    };

    const macroSchema = {
      type: Type.OBJECT,
      properties: {
        protein: { type: Type.NUMBER, description: "Gramas de proteína" },
        carbs: { type: Type.NUMBER, description: "Gramas de carboidrato" },
        fats: { type: Type.NUMBER, description: "Gramas de gordura" },
        calories: { type: Type.NUMBER, description: "Total calórico diário" },
      },
      required: ["protein", "carbs", "fats", "calories"],
    };

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING, description: "Resumo motivacional curto e estratégia geral." },
        macros: macroSchema,
        nutritionPlan: { type: Type.ARRAY, items: mealSchema },
        workoutPlan: { type: Type.ARRAY, items: workoutSessionSchema },
      },
      required: ["summary", "macros", "nutritionPlan", "workoutPlan"],
    };

    // 6) Chamar Gemini (server-side)
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
      return new Response(JSON.stringify({ error: "No response from AI" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 7) Devolver JSON para o frontend
    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};