import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the JSON schema for the structured output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    step_by_step_reasoning: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Uma lista de passos lógicos tomados para identificar os alimentos e estimar porções.",
    },
    food_items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          portion_estimate: { type: Type.STRING, description: "ex: '1 xícara', '150g', 'tamanho da palma da mão'" },
          calories: { type: Type.NUMBER },
          confidence_score: { type: Type.NUMBER, description: "Entre 0 e 1" },
          macronutrients: {
             type: Type.OBJECT,
             properties: {
                protein: { type: Type.STRING },
                carbs: { type: Type.STRING },
                fat: { type: Type.STRING },
             }
          }
        },
        required: ["name", "portion_estimate", "calories", "confidence_score"],
      },
    },
    total_calories: { type: Type.NUMBER },
    overall_confidence: { type: Type.NUMBER, description: "Entre 0 e 1" },
    uncertainty_factors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de fatores que podem afetar a precisão (ex: óleo escondido, profundidade do molho).",
    },
    health_tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Breves conselhos acionáveis baseados na refeição.",
    }
  },
  required: ["step_by_step_reasoning", "food_items", "total_calories", "overall_confidence", "uncertainty_factors", "health_tips"],
};

export const analyzeImage = async (base64Image: string): Promise<AnalysisResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: `Atue como um designer de produtos mobile expert e engenheiro de visão computacional especializado em reconhecimento de alimentos.
            
            Seu objetivo é gerar estimativas calóricas altamente precisas para qualquer prato na imagem.
            
            Requisitos:
            1) Identifique cada item alimentar claramente (em Português do Brasil).
            2) Estime o tamanho das porções usando dicas visuais.
            3) Recupere valores nutricionais típicos.
            4) Forneça pontuações de confiança.
            5) Destaque incertezas.
            6) Inclua estimativa de macronutrientes (Proteína, Carboidratos, Gorduras) se possível.
            
            Analise a imagem e retorne uma resposta JSON estritamente estruturada. Mantenha os nomes das chaves do JSON em inglês conforme o schema, mas os valores de texto devem ser em PORTUGUÊS DO BRASIL.`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temperature for factual/analytical output
      },
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");
    
    return JSON.parse(text) as AnalysisResponse;

  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    throw error;
  }
};