export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { code, question, testResults } = req.body;
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: `You are a code marker.\n\nQUESTION: ${question}\n\nCODE:\n${code}\n\nRESULTS:\n${testResults}\n\nReturn ONLY valid JSON:\n{"score":<0-100>,"passed":<bool>,"summary":"<1-2 sentences>","strengths":["<s1>","<s2>"],"improvements":["<i1>","<i2>"],"tip":"<tip>"}` }]
    })
  });
  const data = await response.json();
  res.json(JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim()));
}
