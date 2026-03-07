import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { caption } = await request.json();

    if (!caption || !caption.trim()) {
      return Response.json({ error: 'No caption provided' }, { status: 400 });
    }

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Extract the recipe from this social media caption. Return ONLY a valid JSON object with no extra text, markdown, or explanation.

The JSON must have this exact structure:
{
  "title": "Recipe name (infer a good one if not stated)",
  "ingredients": [
    { "name": "ingredient name", "amount": "quantity and unit" }
  ],
  "instructions": "Step by step instructions as a single string"
}

If amounts are not specified, make a reasonable guess.
If there are no clear instructions, write brief ones based on context.

Caption:
${caption}`,
        },
      ],
    });

    const text = message.content[0].text.trim();

    // Strip markdown fences if present
    const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    const parsed = JSON.parse(clean);

    return Response.json(parsed);
  } catch (error) {
    console.error('Extract ingredients error:', error);
    return Response.json({ error: 'Failed to extract ingredients' }, { status: 500 });
  }
}