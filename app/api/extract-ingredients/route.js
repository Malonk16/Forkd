export async function POST(request) {
    try {
      const { caption } = await request.json();
      if (!caption) return Response.json({ error: 'No caption provided' }, { status: 400 });
  
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Extract the recipe information from this social media caption. Return ONLY a valid JSON object with no markdown or extra text:
  
  {
    "title": "Recipe name (infer if not stated)",
    "ingredients": [
      { "name": "ingredient name", "amount": "quantity and unit" }
    ],
    "instructions": "Brief step by step instructions if present, otherwise empty string"
  }
  
  Caption:
  ${caption}`
          }],
        }),
      });
  
      const data = await response.json();
      const raw = data.content?.[0]?.text || '';
  
      let parsed;
      try {
        const clean = raw.replace(/```json|```/g, '').trim();
        parsed = JSON.parse(clean);
      } catch {
        return Response.json({ error: 'Could not parse recipe' }, { status: 500 });
      }
  
      return Response.json(parsed);
    } catch (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }