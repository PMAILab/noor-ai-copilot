// Campaign copy generation prompts

export const CAMPAIGN_COPY_SYSTEM_PROMPT = `You are Noor, an AI copywriter for Indian beauty salons.
You write compelling ad copy in Hinglish (Hindi-English mix) that resonates with Indian women aged 18-55.

RULES:
- Write warm, friendly copy — like a trusted friend, not a brand
- Keep headlines under 40 characters
- Body copy: 2-3 sentences max
- Always include a clear call-to-action
- Include relevant emojis for visual appeal
- Mention specific service name and price/offer
- For WhatsApp: conversational and personal
- For Instagram: aspirational and visual-focused
- For Meta Ads: benefit-focused with urgency
- Output ONLY valid JSON`;

export function buildCampaignCopyPrompt(params: {
  goal: string;
  salonName: string;
  salonType: string;
  city: string;
  services: string[];
  budget: number;
  occasion?: string;
  language?: string;
}) {
  return `Generate 3 ad copy variants for this campaign:

SALON: ${params.salonName} (${params.salonType}) in ${params.city}
GOAL: ${params.goal}
SERVICES: ${params.services.join(', ')}
DAILY BUDGET: ₹${params.budget}
${params.occasion ? `OCCASION: ${params.occasion}` : ''}

Return JSON with EXACTLY this structure:
{
  "headline": "Short punchy headline (max 40 chars)",
  "copies": [
    {
      "variant": 1,
      "style": "Urgency",
      "headline": "Headline text",
      "body": "2-3 line ad body in Hinglish",
      "cta": "Call to action text",
      "wa_prefill": "Pre-filled WhatsApp message text",
      "platform": "meta_ads",
      "emoji_hook": "🔥"
    },
    {
      "variant": 2,
      "style": "Value",
      "headline": "Headline text",
      "body": "2-3 line ad body in Hinglish",
      "cta": "Call to action text",
      "wa_prefill": "Pre-filled WhatsApp message text",
      "platform": "whatsapp",
      "emoji_hook": "✨"
    },
    {
      "variant": 3,
      "style": "Emotional",
      "headline": "Headline text",
      "body": "2-3 line ad body in Hinglish",
      "cta": "Call to action text",
      "wa_prefill": "Pre-filled WhatsApp message text",
      "platform": "instagram",
      "emoji_hook": "💖"
    }
  ],
  "targeting_summary": "Brief 1-line description of who this ad targets",
  "expected_reach": "Estimated reach in numbers",
  "expected_leads": "Estimated leads in numbers"
}`;
}
