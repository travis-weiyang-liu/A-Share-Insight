import { GoogleGenAI } from "@google/genai";
import { AnalysisResponse, MarketAnalysis, PortfolioItem, PortfolioAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-2.5-flash";

export const analyzeMarket = async (): Promise<AnalysisResponse> => {
  const prompt = `
    Role: You are a senior financial analyst specializing in the Chinese A-share market (A股).
    
    Task: 
    1. Search for the latest financial news (focusing on today's date). 
    2. Gather data on:
       - The closing performance of US major indices (S&P 500, Nasdaq, DJIA) from the most recent trading session and their potential impact on A-shares.
       - Recent Chinese government economic policies, central bank (PBOC) announcements, or regulatory changes.
       - Major industry news affecting the Chinese market today.
    3. Analyze the combined impact of these factors on the A-share market for the coming trading day.
    4. Provide specific recommendations:
       - 3-5 Key Sectors with sentiment scores (0-100, where >50 is bullish).
       - 3 Recommended ETFs.
       - 5 Specific Stock Picks (A-share codes preferred, e.g., 600519).
    
    CRITICAL OUTPUT FORMAT:
    You MUST output the analysis in a strictly valid JSON block inside a markdown code block (\`\`\`json ... \`\`\`).
    The JSON structure must match this interface:
    {
      "date": "YYYY-MM-DD",
      "marketOverview": "Brief summary of the overall market sentiment.",
      "usMarketImpact": "Analysis of US market influence.",
      "policyImpact": "Analysis of domestic policy influence.",
      "prediction": "Bullish" | "Bearish" | "Volatile" | "Neutral",
      "sectors": [
        { "name": "Sector Name", "sentiment": 80, "reason": "Why this sector is good" }
      ],
      "recommendedETFs": [
        { "symbol": "Code", "name": "Name", "category": "Category" }
      ],
      "topStocks": [
        { "symbol": "Code", "name": "Name", "reason": "Why pick this", "expectedTrend": "Up" }
      ],
      "disclaimer": "Standard financial disclaimer in Chinese."
    }
    
    Language: The content within the JSON values MUST be in Simplified Chinese (简体中文).
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    
    let parsedData: MarketAnalysis | null = null;
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        parsedData = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("JSON Parse Error:", e);
      }
    } else {
        try {
            parsedData = JSON.parse(text);
        } catch(e) {
            console.warn("Could not parse JSON from response");
        }
    }

    return {
      data: parsedData,
      sources: groundingChunks as any[],
      rawText: text
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const analyzeUserPortfolio = async (
  portfolio: PortfolioItem[], 
  marketContext: MarketAnalysis
): Promise<PortfolioAnalysis> => {
  const prompt = `
    Role: You are a personalized investment advisor for the Chinese A-share market.
    
    Context: 
    Here is the market analysis for today (${marketContext.date}):
    ${JSON.stringify(marketContext)}

    User Portfolio:
    ${JSON.stringify(portfolio)}

    Task:
    Based strictly on the "Context" (today's market sentiment, policy, and sector trends) and the user's "Portfolio", provide a specific risk analysis and adjustment suggestions.

    Output Requirements:
    Return a strictly valid JSON block (\`\`\`json ... \`\`\`) matching this structure:
    {
      "overallRisk": "High" | "Medium" | "Low",
      "summary": "A brief paragraph summarizing how today's market affects this specific portfolio.",
      "holdingsAdvice": [
        {
          "symbol": "Code from portfolio",
          "action": "Buy" | "Sell" | "Hold" | "Reduce" | "Add",
          "riskLevel": "High" | "Medium" | "Low",
          "reason": "Specific reason based on today's market news."
        }
      ],
      "suggestedAdjustments": [
        "A string list of general advice, e.g., 'Consider reducing exposure to Tech sector due to US sanctions news'."
      ]
    }

    Language: Simplified Chinese (简体中文).
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      // No googleSearch needed here, as we are using the context from the previous search
    });

    const text = response.text || "";
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    } else {
      return JSON.parse(text);
    }
  } catch (error) {
    console.error("Portfolio Analysis Error:", error);
    throw error;
  }
};
