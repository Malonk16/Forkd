import Anthropic from '@anthropic-ai/sdk';
import { verifyAuth, checkRateLimit, validateOrigin, unauthorizedResponse, rateLimitResponse, forbiddenResponse } from '../middleware';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ALLOWED_MEDIA_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in base64 chars

export async function POST(request) {
  try {
    if (!validateOrigin(request)) return forbiddenResponse();
    const { user, error: authError } = await verifyAuth(request);
    if (authError || !user) return unauthorizedResponse(authError);
    const { allowed } = checkRateLimit(user.id);
    if (!allowed) return rateLimitResponse();

    const { image, mediaType } = await request.json();
    if (!image) return Response.json({ error: 'No image provided' }, { status: 400 });
    if (!ALLOWED_MEDIA_TYPES.includes(mediaType)) return Response.json({ error: 'Invalid image type. Use JPEG, PNG, or WebP.' }, { status: 400 });
    if (image.length > MAX_IMAGE_SIZE) return Response.json({ error: 'Image too large (max 5MB)' }, { status: 400 });

    const message = await client.messages.create({
      model: 'claude-opus-4-5', max_tokens: 1000,
      messages: [{ role: 'user', content: [
        { type: 'image', source: { type: 'base64', media_type: mediaType, data: image } },
        { type: 'text', text: `Look at this screenshot and extract any recipe you can find.\n\nReturn ONLY a JSON object:\n{\n  "title": "<recipe name>",\n  "ingredients": [{"name": "<ingredient>", "amount": "<amount>"}],\n  "instructions": "<full instructions as a single string>",\n  "error": "<only include if no recipe found>"\n}\n\nIf no recipe is present, return { "error": "No recipe found in this screenshot" }.` }
      ]}],
    });

    const text = message.content[0].text.trim();
    const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    return Response.json(JSON.parse(clean));
  } catch (error) {
    console.error('Screenshot extract error:', error);
    return Response.json({ error: 'Failed to read screenshot' }, { status: 500 });
  }
}