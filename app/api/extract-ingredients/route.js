import Anthropic from '@anthropic-ai/sdk';
import { verifyAuth, checkRateLimit, validateOrigin, unauthorizedResponse, rateLimitResponse, forbiddenResponse } from '../middleware';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    if (!validateOrigin(request)) return forbiddenResponse();
    const { user, error: authError } = await verifyAuth(request);
    if (authError || !user) return unauthorizedResponse(authError);
    const { allowed } = checkRateLimit(user.id);
    if (!allowed) return rateLimitResponse();

    const body = await request.json();
    const { caption } = body;
    if (!caption || typeof caption !== 'string' || !caption.trim()) return Response.json({ error: 'No caption provided' }, { status: 400 });
    if (caption.length > 5000) return Response.json({ error: 'Caption too long (max 5000 characters)' }, { status: 400 });
    const sanitized = caption.replace(/```/g, '').slice(0, 5000);

    const message = await client.messages.create({
      model: 'claude-opus-4-5', max_tokens: 1024,
      messages: [{ role: 'user', content: `Extract the recipe from this social media caption. Return ONLY a valid JSON object with no extra text, markdown, or explanation.\n\nThe JSON must have this exact structure:\n{\n  "title": "Recipe name",\n  "ingredients": [{ "name": "ingredient name", "amount": "quantity and unit" }],\n  "instructions": "Step by step instructions as a single string"\n}\n\nCaption:\n${sanitized}` }],
    });

    const text = message.content[0].text.trim();
    const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    return Response.json(JSON.parse(clean));
  } catch (error) {
    console.error('Extract ingredients error:', error);
    return Response.json({ error: 'Failed to extract ingredients' }, { status: 500 });
  }
}