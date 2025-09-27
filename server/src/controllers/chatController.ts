import OpenAI from "openai"
import fetch from "node-fetch";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { saveContext } from "../services/contextService"

interface GeminiResponse {
  candidates?: { content?: { parts?: { text: string }[] } }[];
}

interface GrokResponse {
  choices?: { message?: { content: string } }[];
}

interface DeepSeekResponse {
  choices?: { message?: { content: string } }[];
}

interface OpenAIResponse {
  choices?: { message?: { content: string } }[];
}

type TimedResponse<T> = {
  response: T | null;
  error?: string;
};

async function timedFetch<T>(url: string, options: any, parser: (r: any) => T): Promise<TimedResponse<T>> {
    const start = Date.now();
    try {
        const res = await fetch(url, options);
        const json = await res.json();
        const end = Date.now();
        return { response: parser(json) };
    } catch (err: any) {
        const end = Date.now();
        return { response: null, error: err.message };
    }
}

function buildPrompt(message: string, contexts?: string[]): string {
    return `Patient Question: ${message}`;
}

function buildSystemMessage(contexts = []) {
  const baseMessage = `You are a healthcare assistant. 
Only respond to health-related questions. 
Give helpful, clear, and simple information without giving strict instructions or commands. 
If the question is not about health, reply: 
"I'm here to help only with health-related questions."`;

  if (contexts && contexts.length > 0) {
    return `${baseMessage}

Consider the patient's context: ${contexts.join(', ')}. Provide personalized health information based on this context.`;
  }

  return baseMessage;
}

function geminiPrompt(message:String,contexts?: string[]): string {
    const baseMessage = `You are a healthcare assistant. 
Only respond to health-related questions. 
Give helpful, clear, and simple information without giving strict instructions or commands. 
If the question is not about health, reply: 
"I'm here to help only with health-related questions."`;

  if (contexts && contexts.length > 0) {
    return `${baseMessage}

Consider the patient's context: ${contexts.join(', ')}. Provide personalized health information based on this context.`;
  }
  return `${baseMessage}
Patient Question: ${message}`;
}

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message, sessionId, selectedApi, contexts } = req.body;
        const currentSessionId = sessionId || uuidv4();

        const prompt = buildPrompt(message, contexts);

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
        const GEMINI_URL = `${process.env.GEMINI_URL}${GEMINI_API_KEY}`;

        const GROK_API_KEY = process.env.GROK_API_KEY!;
        const GROK_URL = process.env.GROK_URL

        const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
        const DEEPSEEK_URL = process.env.DEEPSEEK_URL!;

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
        const OPENAI_URL = process.env.OPENAI_URL!;

        let apiResponse: { answer: string; } = {
            answer: "No response",
        };

        if (selectedApi === "gemini") {
            const newPrompt = geminiPrompt(message,contexts)
            const geminiRes = await timedFetch<GeminiResponse>(
                GEMINI_URL,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ role: "user", parts: [{ text: newPrompt }] }],
                    }),
                },
                (json) => json
            );
            console.log(geminiRes);
            apiResponse = {
                answer:
                geminiRes.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
                "No response from Gemini.",
            };
        } else if (selectedApi === "grok") {
            const client = new OpenAI({
                apiKey: GROK_API_KEY,
                baseURL: GROK_URL,
            });
            
            const systemMessage = buildSystemMessage(contexts) 
                
            const completion: OpenAI.Chat.Completions.ChatCompletion =
            await client.chat.completions.create({
                model: "grok-4",
                messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: prompt },
                ],
            });
            apiResponse = {
                answer:
                completion.choices[0]?.message?.content ??
                "No response from Grok AI.",
            };
        } else if (selectedApi === "deepseek") {
            const systemMessage = buildSystemMessage(contexts)
            const deepSeekRes = await timedFetch<DeepSeekResponse>(
                DEEPSEEK_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: "deepseek-chat",
                        messages: [
                        { role: "system", content: systemMessage },
                        { role: "user", content: prompt },
                        ],
                    }),
                },
                (json) => json
            );
            apiResponse = {
                answer:
                deepSeekRes.response?.choices?.[0]?.message?.content ??
                "No response from DeepSeek.",
            };
        } else if (selectedApi === "openai") {
            const systemMessage = buildSystemMessage(contexts)     
            const openaiRes = await timedFetch<OpenAIResponse>(
                OPENAI_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${OPENAI_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [
                        { role: "system", content: systemMessage },
                        { role: "user", content: prompt },
                        ],
                    }),
                },
                (json) => json
            );
            apiResponse = {
                answer:
                openaiRes.response?.choices?.[0]?.message?.content ??
                "No response from OpenAI.",
            };
        }
        saveContext(req.body.userId , req.body.message)
        res.json({
            success: true,
            data: {
                responses: {
                [selectedApi]: apiResponse,
                },
                sessionId: currentSessionId,
                contextsUsed: contexts || [], 
            },
        });
    } catch (error) {
        console.error("Chat controller error:", error);
        next(error);
    }
};