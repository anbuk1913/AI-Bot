import fetch from "node-fetch";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

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
  time: number; // ms
  error?: string;
};

async function timedFetch<T>(url: string, options: any, parser: (r: any) => T): Promise<TimedResponse<T>> {
    const start = Date.now();
    try {
        const res = await fetch(url, options);
        const json = await res.json();
        const end = Date.now();
        return { response: parser(json), time: end - start };
    } catch (err: any) {
        const end = Date.now();
        return { response: null, time: end - start, error: err.message };
    }
}

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message, sessionId, selectedApi } = req.body;
        const currentSessionId = sessionId || uuidv4();

        let patientContext = "";
        const prompt = patientContext
        ? `${patientContext}\n\nPatient Question: ${message}`
        : message;

        // API keys
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        const GROK_API_KEY = process.env.GROK_API_KEY!;
        const GROK_URL = "https://api.x.ai/v1/chat/completions";

        const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
        const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
        const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

        let apiResponse: { answer: string; responseTime: number } = {
            answer: "No response",
            responseTime: 0,
        };

        if (selectedApi === "gemini") {
            const geminiRes = await timedFetch<GeminiResponse>(
                GEMINI_URL,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ role: "user", parts: [{ text: prompt }] }],
                    }),
                },
                (json) => json
            );
            apiResponse = {
                answer:
                geminiRes.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
                "No response from Gemini.",
                responseTime: geminiRes.time,
            };
        } else if (selectedApi === "grok") {
            const grokRes = await timedFetch<GrokResponse>(
                GROK_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${GROK_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: "grok-3",
                        messages: [{ role: "user", content: prompt }],
                    }),
                },
                (json) => json
            );
            apiResponse = {
                answer:
                grokRes.response?.choices?.[0]?.message?.content ??
                "No response from Grok.",
                responseTime: grokRes.time,
            };
        } else if (selectedApi === "deepseek") {
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
                        { role: "system", content: "You are a helpful medical assistant." },
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
                responseTime: deepSeekRes.time,
            };
        } else if (selectedApi === "openai") {
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
                        { role: "system", content: "You are a medical assistant." },
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
                responseTime: openaiRes.time,
            };
        }
        res.json({
            success: true,
            data: {
                responses: {
                [selectedApi]: apiResponse,
                },
                sessionId: currentSessionId,
            },
        });
    } catch (error) {
        console.error("Chat controller error:", error);
        next(error);
    }
};





// OPEN AI

// export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { message, patientId, sessionId } = req.body;
//     const currentSessionId = sessionId || uuidv4();

//     // Get patient context if patientId provided
//     let patientContext = '';
//     if (patientId) {
//       const patient = await patientService.getPatientById(patientId);
//       if (patient) {
//         patientContext = `Patient Information:
//         Name: ${patient.name}
//         Age: ${patient.age}
//         Current Medications: ${patient.medicalHistory.medications.map(med => `${med.name} ${med.dosage}`).join(', ')}
//         Upcoming Appointments: ${patient.appointments.filter(apt => apt.status === 'scheduled').length}
//         Account Balance: ${patient.billing?.balance || 0}`;
//       }
//     }

//     // Prepare messages for OpenAI
//     const messages = [
//       {
//         role: 'user' as const,
//         content: patientContext ? `${patientContext}\n\nPatient Question: ${message}` : message
//       }
//     ];

//     // Generate AI response
//     const aiResponse = await openaiService.generateResponse(messages);

//     // Save chat history
//     if (patientId) {
//       await ChatHistory.findOneAndUpdate(
//         { patientId, sessionId: currentSessionId },
//         {
//           $push: {
//             messages: [
//               { role: 'user', content: message, timestamp: new Date() },
//               { role: 'assistant', content: aiResponse, timestamp: new Date() }
//             ]
//           }
//         },
//         { upsert: true, new: true }
//       );
//     }

//     res.json({
//       success: true,
//       data: {
//         response: aiResponse,
//         sessionId: currentSessionId
//       }
//     });

//   } catch (error) {
//     logger.error('Chat controller error:', error);
//     next(error);
//   }
// };



// export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { message, patientId, sessionId } = req.body;
//     const currentSessionId = sessionId || uuidv4();

//     const GROK_API_URL  = 'https://api.x.ai/v1/chat/completions'; 
//     const GROK_API_KEY = process.env.GROK_API_KEY;

//     let patientContext = '';
//     if (patientId) {
//       const patient = await patientService.getPatientById(patientId);
//       if (patient) {
//         patientContext = `Patient Information:
//         Name: ${patient.name}
//         Age: ${patient.age}
//         Current Medications: ${patient.medicalHistory.medications.map(m => `${m.name} ${m.dosage}`).join(', ')}
//         Upcoming Appointments: ${patient.appointments.filter(a => a.status === 'scheduled').length}
//         Account Balance: ${patient.billing?.balance || 0}`;
//       }
//     }

//     // Compose prompt (or messages) for Grok
//     const prompt = patientContext 
//       ? `${patientContext}\n\nPatient Question: ${message}` 
//       : message;

//     // Call Grok
//     const apiRes = await fetch(GROK_API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${GROK_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: 'grok-3',  // or whichever model you want: check your access (grok-4, grok-code-fast-1 etc.) :contentReference[oaicite:3]{index=3}
//         messages: [
//           { role: 'user', content: prompt }
//         ]
//       })
//     });

//     if (!apiRes.ok) {
//       const text = await apiRes.text();
//       throw new Error(`Grok API error ${apiRes.status}: ${text}`);
//     }

//     const apiJson = await apiRes.json() as any;
//     // depends on the structure the API returns
    
//     const aiResponse = apiJson.choices?.[0]?.message?.content ?? "Sorry, no response from Grok.";

//     // Save chat history if needed
//     // if (patientId) {
//     //   await ChatHistory.findOneAndUpdate(
//     //     { patientId, sessionId: currentSessionId },
//     //     {
//     //       $push: {
//     //         messages: [
//     //           { role: 'user', content: message, timestamp: new Date() },
//     //           { role: 'assistant', content: aiResponse, timestamp: new Date() }
//     //         ]
//     //       }
//     //     },
//     //     { upsert: true, new: true }
//     //   );
//     // }

//     res.json({
//       success: true,
//       data: {
//         response: aiResponse,
//         sessionId: currentSessionId
//       }
//     });
//   } catch (error) {
//     console.error('Chat controller error:', error);
//     next(error);
//   }
// };


// export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
//   try {

    
//     const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
//     const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

//     const { message, patientId, sessionId } = req.body;
//     const currentSessionId = sessionId || uuidv4();

//     // Build patient context if available
//     let patientContext = "";
//     if (patientId) {
//       const patient = await patientService.getPatientById(patientId);
//       if (patient) {
//         patientContext = `Patient Information:
//         Name: ${patient.name}
//         Age: ${patient.age}
//         Current Medications: ${patient.medicalHistory.medications.map(m => `${m.name} ${m.dosage}`).join(", ")}
//         Upcoming Appointments: ${patient.appointments.filter(a => a.status === "scheduled").length}
//         Account Balance: ${patient.billing?.balance || 0}`;
//       }
//     }

//     const prompt = patientContext
//       ? `${patientContext}\n\nPatient Question: ${message}`
//       : message;

//     // Call DeepSeek
//     const apiRes = await fetch(DEEPSEEK_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "deepseek-chat", // or deepseek-coder, depending on your use case
//         messages: [
//           { role: "system", content: "You are a helpful medical assistant chatbot." },
//           { role: "user", content: prompt },
//         ],
//       }),
//     });

//     if (!apiRes.ok) {
//       const text = await apiRes.text();
//       throw new Error(`DeepSeek API error ${apiRes.status}: ${text}`);
//     }

//     // 👇 Fix typing issue: declare interface
//     interface DeepSeekResponse {
//       choices: {
//         message?: {
//           role: string;
//           content: string;
//         };
//       }[];
//     }

//     const apiJson = await apiRes.json() as any;
//     // const apiJson: DeepSeekResponse = await apiRes.json();

//     const aiResponse =
//       apiJson.choices?.[0]?.message?.content ??
//       "Sorry, no response from DeepSeek.";

//     // Save chat history if patient exists
//     // if (patientId) {
//     //   await ChatHistory.findOneAndUpdate(
//     //     { patientId, sessionId: currentSessionId },
//     //     {
//     //       $push: {
//     //         messages: [
//     //           { role: "user", content: message, timestamp: new Date() },
//     //           { role: "assistant", content: aiResponse, timestamp: new Date() },
//     //         ],
//     //       },
//     //     },
//     //     { upsert: true, new: true }
//     //   );
//     // }

//     res.json({
//       success: true,
//       data: {
//         response: aiResponse,
//         sessionId: currentSessionId,
//       },
//     });
//   } catch (error) {
//     console.error("Chat controller error:", error);
//     next(error);
//   }
// };