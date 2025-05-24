import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { deals } = await req.json();

    const prompt = `
You are an AI sales assistant. Given these deals, estimate the probability of winning each (0-1) and provide a short reason. 
Deals:
${deals.map((d, i) => `${i + 1}. ${d.name} (Stage: ${d.stage}, Value: ${d.value})`).join("\n")}
Summarize your predictions in plain text, one per deal, including the probability and reason.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    return new Response(text.trim(), { status: 200, headers: { "Content-Type": "text/plain" } });
  } catch (err) {
    return new Response("AI prediction failed.", { status: 500, headers: { "Content-Type": "text/plain" } });
  }
}