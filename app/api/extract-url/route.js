import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) return Response.json({ error: 'No URL provided' }, { status: 400 });

    // Detect platform
    const platform = url.includes('tiktok') ? 'TikTok'
      : url.includes('instagram') ? 'Instagram'
      : url.includes('youtube') ? 'YouTube'
      : 'Other';

    // Try to fetch the page HTML for context
    let pageText = '';
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
        },
        signal: AbortSignal.timeout(5000),
      });
      const html = await res.text();
      // Extract readable text — strip tags, keep content
      pageText = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 4000); // Keep first 4000 chars
    } catch (e) {
      // Page fetch failed — that's okay, Claude will work with the URL alone
      pageText = '';
    }

    const prompt = pageText
      ? `This is a ${platform} post URL: ${url}\n\nHere is text extracted from the page:\n${pageText}\n\nExtract the recipe from this content.`
      : `This is a ${platform} post URL: ${url}\n\nI wasn't able to fetch the page content, but based on the URL please try to extract or infer recipe details if possible. If you cannot, return an error.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `${prompt}

Return ONLY a JSON object with no extra text:
{
  "title": "<recipe name>",
  "ingredients": [{"name": "<ingredient>", "amount": "<amount>"}],
  "instructions": "<full instructions as a single string>",
  "error": "<only include this key if no recipe could be found>"
}`,
      }],
    });

    const text = message.content[0].text.trim();
    const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(clean);
    return Response.json({ ...parsed, platform });
  } catch (error) {
    console.error('URL extract error:', error);
    return Response.json({ error: 'Failed to extract recipe from URL' }, { status: 500 });
  }
}