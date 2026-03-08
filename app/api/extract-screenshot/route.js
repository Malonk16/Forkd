import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { image, mediaType } = await request.json();
    if (!image) return Response.json({ error: 'No image provided' }, { status: 400 });

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType || 'image/jpeg',
              data: image,
            },
          },
          {
            type: 'text',
            text: `Look at this screenshot and extract any recipe you can find — including from captions, comments, or on-screen text.

Return ONLY a JSON object with no extra text or markdown:
{
  "title": "<recipe name>",
  "ingredients": [{"name": "<ingredient>", "amount": "<amount>"}],
  "instructions": "<full instructions as a single string>",
  "error": "<only include this key if no recipe could be found>"
}

If amounts aren't visible, make a reasonable estimate. If no recipe is present, return { "error": "No recipe found in this screenshot" }.`,
          },
        ],
      }],
    });

    const text = message.content[0].text.trim();
    const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(clean);
    return Response.json(parsed);
  } catch (error) {
    console.error('Screenshot extract error:', error);
    return Response.json({ error: 'Failed to read screenshot' }, { status: 500 });
  }
}