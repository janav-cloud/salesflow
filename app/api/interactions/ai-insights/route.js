import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { interactions } = await req.json();

    const prompt = `
You are an AI assistant. Summarize the following customer interactions and extract key insights or important events. 
Interactions:
${interactions.map((i, idx) => `${idx + 1}. [${i.type}] ${i.content} (DealID: ${i.dealId || "N/A"}, Date: ${i.createdAt})`).join("\n")}
Provide a concise summary of the most important insights and events in plain text.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    return new Response(text.trim(), { status: 200, headers: { "Content-Type": "text/plain" } });
  } catch (err) {
    return new Response("AI insights generation failed.", { status: 500, headers: { "Content-Type": "text/plain" } });
  }
}