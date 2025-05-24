import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { tasks } = await req.json();

    const prompt = `
You are an AI assistant. Given the following sales tasks, analyze and summarize which tasks are most urgent or impactful and why. 
Tasks:
${tasks.map((t, i) => `${i + 1}. ${t.title} (Due: ${t.dueDate}, Priority: ${t.priority}, Status: ${t.status})`).join("\n")}
Provide a concise summary of your reasoning and prioritization, in plain text.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    return new Response(text.trim(), { status: 200, headers: { "Content-Type": "text/plain" } });
  } catch (err) {
    return new Response("AI analysis failed.", { status: 500, headers: { "Content-Type": "text/plain" } });
  }
}