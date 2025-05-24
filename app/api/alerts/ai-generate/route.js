import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { deals, tasks } = await req.json();

    const prompt = `
You are an AI sales assistant. Analyze the following deals and tasks, and summarize any at-risk deals or urgent issues as alerts. 
For each alert, mention the deal or task, the severity (Low|Medium|High), and a short reason. 
Deals:
${deals.map((d, i) => `${i + 1}. ${d.name} (ID: ${d.id}, Stage: ${d.stage}, Probability: ${d.probability}, Value: ${d.value})`).join("\n")}
Tasks:
${tasks.map((t, i) => `${i + 1}. ${t.title} (Due: ${t.dueDate}, Priority: ${t.priority}, Status: ${t.status}, DealID: ${t.dealId || "N/A"})`).join("\n")}
Summarize the alerts in plain text, one per line.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    return new Response(text.trim(), { status: 200, headers: { "Content-Type": "text/plain" } });
  } catch (err) {
    return new Response("AI alert generation failed.", { status: 500, headers: { "Content-Type": "text/plain" } });
  }
}