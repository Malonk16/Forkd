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

    const { url } = await request.json();
    if (!url || typeof url !== 'string') return Response.json({ error: 'No URL provided' }, { status: 400 });
    if (url.length > 2000) return Response.json({ error: 'URL too long' }, { status: 400 });

    // Validate URL format and only allow http/https
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('Invalid protocol');
    } catch {
      return Response.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const platform = url.includes('tiktok') ? 'TikTok' : url.includes('instagram') ? 'Instagram' : url.includes('youtube') ? 'YouTube' : 'Other';

    let pageText = '';
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15' },
        signal: AbortSignal.timeout(5000),
      });
      const html = await res.text();
      pageText = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 4000);
    } catch (e) { pageText = ''; }

    const prompt = pageText
      ? `This is a ${platform} post URL: ${url}\n\nPage text:\n${pageText}\n\nExtract the recipe.`
      : `This is a ${platform} post URL: ${url}\n\nCould not fetch page content. Return an error.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-5', max_tokens: 1000,
      messages: [{ role: 'user', content: `${prompt}\n\nReturn ONLY a JSON object:\n{\n  "title": "<recipe name>",\n  "ingredients": [{"name": "<ingredient>", "amount": "<amount>"}],\n  "instructions": "<full instructions>",\n  "error": "<only if no recipe found>"\n}` }],
    });

    const text = message.content[0].text.trim();
    const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    return Response.json({ ...JSON.parse(clean), platform });
  } catch (error) {
    console.error('URL extract error:', error);
    return Response.json({ error: 'Failed to extract recipe from URL' }, { status: 500 });
  }
}