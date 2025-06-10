import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function analyzeError({ message, stack }) {
  const prompt = `
You are a senior developer assistant. Analyze the following JavaScript/Node.js error and provide a concise summary and fix suggestion.

Message:
${message}

Stack trace:
${stack}

Respond in max 2 bullet points. Keep it actionable.
`

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 300
    })

    return res.choices[0].message.content.trim()
  } catch (err) {
    console.error('[AI Suggestion Failed]', err)
    return null
  }
}
