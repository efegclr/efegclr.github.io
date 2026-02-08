
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Siz, alkol metabolizması ve kan alkol konsantrasyonu (BAC) konularında uzman bir asistansınız.
Kullanıcılara promil hesaplaması, alkolün vücuttaki etkileri ve güvenli sürüş limitleri hakkında bilgi veriyorsunuz.

Önemli Kurallar:
1. Her zaman alkollü araç kullanmanın tehlikeli ve yasa dışı olduğunu hatırlatın.
2. Hesaplamaların sadece tahmin olduğunu, gerçek sonucun cihazla ölçülmesi gerektiğini vurgulayın.
3. Türkiye'deki yasal sınırın hususi araçlar için 0.50 promil olduğunu belirtin.
4. Yanıtlarınız kısa, net ve bilimsel temelli olmalıdır.
`;

export async function askAI(question: string) {
  const apiKey = process.env.API_KEY || "";
  if (!apiKey) return "API Anahtarı bulunamadı.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    });

    return response.text || "Üzgünüm, şu an yanıt veremiyorum.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI ile iletişimde bir hata oluştu.";
  }
}
