const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Check if API key is available
if (!OPENROUTER_API_KEY) {
  console.error('OpenRouter API key is missing. Please check your .env file.');
}

export const generateDescription = async (businessInfo, productInfo) => {
  // Check if API key is available
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured. Please check your environment variables.');
  }

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

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Lunexa AI',
      },
      mode: 'cors',
      body: JSON.stringify({
        model: 'microsoft/wizardlm-2-8x22b:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', response.status, errorData);

      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenRouter API key configuration.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (response.status >= 500) {
        throw new Error('OpenRouter service is temporarily unavailable. Please try again later.');
      } else {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log('OpenRouter response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from API');
    }

    const content = data.choices[0].message.content;
    console.log('Raw content:', content);

    // Try to parse JSON, handle cases where AI might return extra text
    let parsedContent;
    try {
      // First try direct parsing
      parsedContent = JSON.parse(content);
    } catch (parseError) {
      console.warn('Direct JSON parse failed, trying to extract JSON from response');
      // Try to extract JSON from the response if it has extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse JSON response from AI');
      }
    }

    // Validate required keys
    const requiredKeys = ['title', 'description', 'hashtags', 'seo_keywords'];
    for (const key of requiredKeys) {
      if (!(key in parsedContent)) {
        throw new Error(`Missing required key: ${key}`);
      }
    }

    return parsedContent;
  } catch (error) {
    console.error('Error in generateDescription:', error);

    // Return specific error messages based on the error type
    if (error.message.includes('Invalid API key')) {
      throw error; // Re-throw specific API key error
    } else if (error.message.includes('Rate limit exceeded')) {
      throw error; // Re-throw rate limit error
    } else if (error.message.includes('service is temporarily unavailable')) {
      throw error; // Re-throw service unavailable error
    } else if (error.message.includes('API request failed')) {
      throw new Error('Unable to connect to AI service. Please check your internet connection and try again.');
    } else if (error.message.includes('Could not parse JSON')) {
      throw new Error('AI service returned an invalid response. Please try again.');
    } else if (error.message.includes('Missing required key')) {
      throw new Error('AI service response was incomplete. Please try again.');
    }

    throw new Error('Failed to generate description. Please try again.');
  }
};