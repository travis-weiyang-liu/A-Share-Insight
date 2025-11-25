export interface Stock {
  symbol: string;
  name: string;
  reason: string;
  expectedTrend: 'Up' | 'Down' | 'Neutral';
}

export interface ETF {
  symbol: string;
  name: string;
  category: string;
}

export interface Sector {
  name: string;
  sentiment: number; // 0 to 100
  reason: string;
}

export interface MarketAnalysis {
  date: string;
  marketOverview: string;
  usMarketImpact: string;
  policyImpact: string;
  prediction: 'Bullish' | 'Bearish' | 'Volatile' | 'Neutral';
  sectors: Sector[];
  recommendedETFs: ETF[];
  topStocks: Stock[];
  disclaimer: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AnalysisResponse {
  data: MarketAnalysis | null;
  sources: GroundingChunk[];
  rawText: string;
}

// --- New Types for Portfolio Module ---

export interface PortfolioItem {
  id: string;
  symbol: string; // e.g., 600519
  name: string;   // e.g., 贵州茅台
  cost: number;   // Average cost per share
  shares: number; // Number of shares held
}

export interface HoldingAdvice {
  symbol: string;
  action: 'Buy' | 'Sell' | 'Hold' | 'Reduce' | 'Add';
  riskLevel: 'High' | 'Medium' | 'Low';
  reason: string;
}

export interface PortfolioAnalysis {
  overallRisk: 'High' | 'Medium' | 'Low';
  summary: string;
  holdingsAdvice: HoldingAdvice[];
  suggestedAdjustments: string[];
}
