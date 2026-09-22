import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.error('Failed to initialize GoogleGenAI client:', err);
      aiClient = null;
    }
  }
  return aiClient;
}

// 1. Health API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'AdaptiveLearn',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 2. AI Tutor Conceptual Explanation API
app.post('/api/tutor/explain', async (req, res) => {
  const { topic, userPrompt, studentContext } = req.body || {};
  const query = topic || userPrompt || 'Binary Trees';
  const difficulty = studentContext?.difficulty || 'Medium';

  const ai = getGeminiAI();

  if (ai) {
    try {
      const systemInstruction = `You are the AdaptiveLearn AI Tutor for B.Tech Computer Science and Engineering students.
Your mission is PURE TEACHING. DO NOT return raw analytics or talk about dashboard metrics.
Respond ONLY with a valid JSON object matching this schema:
{
  "topic": "${query}",
  "briefExplanation": "1-2 sentences crystal clear definition",
  "intuitiveExplanation": "An intuitive everyday analogy that makes the concept click effortlessly",
  "practicalExample": "Where this is used in real engineering systems",
  "codeSnippet": "Clean concise code illustrating the concept (C++, Java, or Python)",
  "easyMnemonic": "Catchy way to remember this concept",
  "importantTip": "Crucial pro-tip or trap to avoid",
  "targetedPracticeQuestion": {
    "question": "A quick multiple choice question to verify comprehension",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why this answer is correct"
  }
}
Tailor depth to student level: ${difficulty}. Output strictly valid JSON.`;

      const prompt = `Teach the student about: "${query}". Context: Student prompt was "${userPrompt || query}".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text?.trim();
      if (text) {
        try {
          const parsed = JSON.parse(text);
          return res.json({ success: true, teaching: parsed, source: 'gemini' });
        } catch {
          // If JSON parse fails, fallback
        }
      }
    } catch (err) {
      console.warn('Gemini tutor call error, using deterministic educational fallback:', err);
    }
  }

  // Graceful fallback: return empty teaching so client uses deterministic knowledge bank
  res.json({ success: true, teaching: null, source: 'deterministic_client' });
});

// 3. AI Tutor Practice Question Generator
app.post('/api/tutor/practice', async (req, res) => {
  const { topic, difficulty } = req.body || {};
  const targetTopic = topic || 'Trees';

  const ai = getGeminiAI();
  if (ai) {
    try {
      const prompt = `Generate 1 multiple-choice practice question on "${targetTopic}" for a B.Tech CSE student at ${difficulty || 'Medium'} difficulty.
Respond strictly with valid JSON:
{
  "question": "Question text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "Detailed explanation",
  "errorCategory": "Conceptual misunderstanding"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const text = response.text?.trim();
      if (text) {
        const question = JSON.parse(text);
        return res.json({ success: true, question });
      }
    } catch (err) {
      console.warn('Gemini practice question generator failed:', err);
    }
  }

  res.json({ success: false, fallback: true });
});

// Vite middleware & Static serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AdaptiveLearn server running at http://0.0.0.0:${PORT}`);
  });
}

start();
