import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!GEMINI_API_KEY) return null;
  if (!ai) ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  return ai;
}

export const isImageGenConfigured = () => Boolean(GEMINI_API_KEY);

// ─── Ad Image Prompt Builder ─────────────────────────────────────────────────
export function buildAdImagePrompt(params: {
  style: string;
  headline: string;
  salonName: string;
  city: string;
  occasion?: string;
  services?: string[];
}): string {
  const { style, headline, salonName, city, occasion, services = [] } = params;

  const styleMap: Record<string, string> = {
    Urgency: 'bold, high-contrast, urgent red-orange accents, limited-time offer energy, dramatic lighting',
    Value: 'clean, trustworthy, gold accents, premium yet affordable, bright natural daylight',
    Emotional: 'warm, soft golden-hour lighting, emotional, feminine, empowering, blush and lavender tones',
  };

  const visualStyle = styleMap[style] || styleMap.Value;
  const serviceStr = services.slice(0, 2).join(' and ') || 'hair and beauty treatment';
  const occasionTag = occasion ? `, ${occasion} festival celebration theme` : '';

  return [
    `Premium Indian beauty salon advertisement photograph for "${salonName}" salon in ${city}${occasionTag}.`,
    `Visual style: ${visualStyle}.`,
    `Square 1:1 format, photorealistic, high-end editorial quality.`,
    `Scene: Elegant Indian woman in her late 20s-30s in a luxurious modern salon receiving ${serviceStr}.`,
    `Bright, clean salon interior with marble countertops, fresh flowers, and warm ambient lighting.`,
    `Professional beauty photography, vibrant but tasteful colors, ultra-sharp focus.`,
    `Text overlay zone reserved at the bottom third: "${headline}".`,
    `Suitable for Instagram feed and Meta Ads. No logos, no extra text, no watermarks.`,
    `Inspired by premium Indian beauty brands like VLCC, Naturals, Lakmé Salon.`,
  ].join(' ');
}

// ─── Gemini 2.0 Flash Image Generation ──────────────────────────────────────
/**
 * Generate an ad image using Gemini 2.0 Flash (native image generation)
 * Falls back to Imagen 3 if not available.
 * Returns a data URL or null on failure.
 */
export async function generateAdImage(prompt: string): Promise<string | null> {
  const client = getAI();
  if (!client) return null;

  // Strategy 1: Try Gemini 2.0 Flash with image output (latest, fastest)
  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: prompt,
      config: {
        responseModalities: ['Text', 'Image'],
        temperature: 1,
      } as any,
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if ((part as any).inlineData?.data) {
        const { mimeType, data } = (part as any).inlineData;
        return `data:${mimeType};base64,${data}`;
      }
    }
  } catch (e) {
    console.warn('Gemini 2.0 Flash image gen failed, trying Imagen 3:', e);
  }

  // Strategy 2: Imagen 3 fallback
  try {
    const response = await client.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '1:1',
        outputMimeType: 'image/jpeg',
        personGeneration: 'ALLOW_ADULT' as any,
      },
    });
    const imageData = response.generatedImages?.[0]?.image?.imageBytes;
    if (imageData) return `data:image/jpeg;base64,${imageData}`;
  } catch (e) {
    console.warn('Imagen 3 generation also failed:', e);
  }

  return null;
}

// ─── Batch image generation for all 3 copy variants ─────────────────────────
export async function generateAdImages(
  variants: Array<{ style: string; headline: string }>,
  context: { salonName: string; city: string; occasion?: string; services?: string[] }
): Promise<(string | null)[]> {
  const prompts = variants.map(v =>
    buildAdImagePrompt({ ...context, style: v.style, headline: v.headline })
  );
  // Sequential to avoid rate limits
  const results: (string | null)[] = [];
  for (const p of prompts) {
    results.push(await generateAdImage(p));
  }
  return results;
}

// ─── AI Text Generation (Gemini 2.5 Pro) ─────────────────────────────────────
/**
 * Generate structured JSON using Gemini 2.5 Pro (latest flagship model)
 */
export async function generateWithGemini(prompt: string, systemPrompt: string): Promise<any> {
  const client = getAI();
  if (!client) throw new Error('Gemini API key not configured');

  const response = await client.models.generateContent({
    model: 'gemini-2.5-pro-preview-05-06',
    contents: [
      { role: 'user', parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }
    ],
    config: {
      temperature: 0.8,
      responseMimeType: 'application/json',
    } as any,
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return JSON.parse(text);
}

// ─── Beautiful placeholder while generating ───────────────────────────────────
export function getPlaceholderImage(style: string): string {
  const configs: Record<string, { from: string; to: string; emoji: string }> = {
    Urgency:   { from: '#7C3AED', to: '#EF4444', emoji: '🔥' },
    Value:     { from: '#4F46E5', to: '#C8922A', emoji: '✨' },
    Emotional: { from: '#BE185D', to: '#7C3AED', emoji: '💖' },
  };
  const c = configs[style] || configs.Value;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${c.from}"/>
        <stop offset="100%" style="stop-color:${c.to}"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#g)" rx="16"/>
    <text x="200" y="170" font-family="serif" font-size="72" fill="white" text-anchor="middle" opacity="0.25">${c.emoji}</text>
    <text x="200" y="230" font-family="sans-serif" font-size="15" fill="white" text-anchor="middle" opacity="0.7">Generating AI image...</text>
    <text x="200" y="255" font-family="sans-serif" font-size="12" fill="white" text-anchor="middle" opacity="0.45">Gemini Imagen 3 • Noor Copilot</text>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
