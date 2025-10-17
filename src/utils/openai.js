const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const generateDescription = async (businessInfo, productInfo) => {
  const prompt = `
Act as an expert e-commerce copywriter.
Generate a product title, SEO-friendly description, hashtags, and SEO keywords.

Business info:
- Name: ${businessInfo.businessName}
- Category: ${businessInfo.category}
- Audience: ${businessInfo.audience}
- Tone: ${businessInfo.tone}
- Market: ${businessInfo.region}

Product info:
- Name: ${productInfo.productName}
- Features: ${productInfo.features}

Return as JSON with keys: title, description, hashtags, seo_keywords
  `.trim();

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo', // or another model
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate description');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
};