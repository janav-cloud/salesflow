import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function generateCategorySummary(leads) {
  const categories = ['Most Likely to Convert', 'Good Scope', 'Future Scope', 'No Scope'];
  const summary = { total: leads.length };

  categories.forEach(cat => {
    const catLeads = leads.filter(lead => lead.Category === cat);
    summary[cat] = {
      count: catLeads.length,
      avgLeadScore: catLeads.length
        ? (catLeads.reduce((sum, l) => sum + (l.Lead_Score || 0), 0) / catLeads.length).toFixed(2)
        : 0,
      avgEmailOpenRate: catLeads.length
        ? (catLeads.reduce((sum, l) => sum + (l.Email_Open_Rate || 0), 0) / catLeads.length).toFixed(2)
        : 0,
    };
  });

  return `
Total Leads: ${summary.total}
- Most Likely to Convert: ${summary['Most Likely to Convert'].count} leads, Avg Lead Score: ${summary['Most Likely to Convert'].avgLeadScore}, Avg Email Open Rate: ${summary['Most Likely to Convert'].avgEmailOpenRate}%
- Good Scope: ${summary['Good Scope'].count} leads, Avg Lead Score: ${summary['Good Scope'].avgLeadScore}, Avg Email Open Rate: ${summary['Good Scope'].avgEmailOpenRate}%
- Future Scope: ${summary['Future Scope'].count} leads, Avg Lead Score: ${summary['Future Scope'].avgLeadScore}, Avg Email Open Rate: ${summary['Future Scope'].avgEmailOpenRate}%
- No Scope: ${summary['No Scope'].count} leads, Avg Lead Score: ${summary['No Scope'].avgLeadScore}, Avg Email Open Rate: ${summary['No Scope'].avgEmailOpenRate}%
  `;
}

function formatLeadDataForAI(full_df) {
  return full_df.slice(0, 50).map((lead, i) => `
Lead ${i + 1}:
- Company Name: ${lead['Company_Name']}
- Industry: ${lead['Industry']}
- Email Open Rate: ${lead['Email_Open_Rate']}
- Click Through Rate: ${lead['Click_Through_Rate']}
- Engagement Score: ${lead['Engagement_Score']}
- Lead Score: ${lead['Lead_Score']}
- Response Time: ${lead['Response_Time']}
- Marketing Spend: ${lead['Marketing_Spend']}
- Demo Scheduled: ${lead['Demo_Scheduled']}
- Converted: ${lead['Converted']}
  `).join('\n');
}

export async function POST(req) {
  try {
    const { leadData } = await req.json();

    if (!leadData || !Array.isArray(leadData)) {
      return NextResponse.json({ error: 'Invalid or missing lead data' }, { status: 400 });
    }

    const categorySummary = generateCategorySummary(leadData);

    const prompt = `
You are a sales and marketing expert analyzing a dataset of leads categorized as "Most Likely to Convert," "Good Scope," "Future Scope," or "No Scope." Below is a summary of the dataset:

${categorySummary}

Based on this data, provide 3 actionable sales and marketing strategies to improve lead conversion, focusing on the top categories (Most Likely to Convert, Good Scope, Future Scope). Each strategy should be a concise bullet point in plain text, tailored to the data provided. Avoid markdown or code blocks.

Example format:
- Strategy for Most Likely to Convert: Personalize email campaigns to boost engagement.
- Strategy for Good Scope: Offer limited-time discounts to encourage quick decisions.
- Strategy for Future Scope: Use educational content to nurture long-term interest.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text().trim();

    return NextResponse.json({ insights });

  } catch (err) {
    console.error('[GENAI ERROR]', err.message, err.stack);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}