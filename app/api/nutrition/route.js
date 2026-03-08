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

    const { ingredients, title } = await request.json();
    if (!ingredients?.length) return Response.json({ error: 'No ingredients' }, { status: 400 });
    if (!Array.isArray(ingredients) || ingredients.length > 50) return Response.json({ error: 'Invalid ingredients' }, { status: 400 });
    if (title && typeof title === 'string' && title.length > 200) return Response.json({ error: 'Title too long' }, { status: 400 });

    const ingredientList = ingredients
      .slice(0, 50)
      .map(i => `${String(i.amount || '').slice(0, 100)} ${String(i.name || '').slice(0, 100)}`)
      .join('\n');

    const message = await client.messages.create({
      model: 'claude-opus-4-5', max_tokens: 256,
      messages: [{ role: 'user', content: `Estimate the nutritional info per serving for this recipe called "${String(title || '').slice(0, 200)}".\n\nIngredients:\n${ingredientList}\n\nReturn ONLY a JSON object:\n{\n  "calories": <number>,\n  "protein": <number in grams>,\n  "carbs": <number in grams>,\n  "fat": <number in grams>,\n  "servings": <number assumed>\n}\n\nRound all values to the nearest whole number.` }],
    });

    const text = message.content[0].text.trim();
    const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    return Response.json(JSON.parse(clean));
  } catch (error) {
    console.error('Nutrition error:', error);
    return Response.json({ error: 'Failed to calculate nutrition' }, { status: 500 });
  }
}