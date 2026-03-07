import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { ingredients, title } = await request.json();
    if (!ingredients?.length) return Response.json({ error: 'No ingredients' }, { status: 400 });

    const ingredientList = ingredients.map(i => `${i.amount} ${i.name}`).join('\n');

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: `Estimate the nutritional info per serving for this recipe called "${title}".

Ingredients:
${ingredientList}

Assume a typical number of servings for this type of dish. Return ONLY a JSON object with no extra text:
{
  "calories": <number>,
  "protein": <number in grams>,
  "carbs": <number in grams>,
  "fat": <number in grams>,
  "servings": <number assumed>
}

Round all values to the nearest whole number.`,
      }],
    });

    const text = message.content[0].text.trim();
    const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(clean);
    return Response.json(parsed);
  } catch (error) {
    console.error('Nutrition error:', error);
    return Response.json({ error: 'Failed to calculate nutrition' }, { status: 500 });
  }
}