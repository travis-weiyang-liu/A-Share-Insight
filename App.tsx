import React, { useState, useEffect } from 'react';
import { analyzeMarket, analyzeUserPortfolio } from './services/geminiService';
import { AnalysisResponse, PortfolioItem, PortfolioAnalysis } from './types';
import { AnalysisCard } from './components/AnalysisCard';
import { SectorChart } from './components/SectorChart';
import { StockTable } from './components/StockTable';
import { PortfolioManager } from './components/PortfolioManager';
import { PortfolioReview } from './components/PortfolioReview';
import { 
  TrendingUp, 
  Globe, 
  ScrollText, 
  PieChart, 
  ListOrdered, 
  Search,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Wallet,
  Sparkles
} from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Portfolio State
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [analyzingPortfolio, setAnalyzingPortfolio] = useState<boolean>(false);
  const [portfolioAnalysis, setPortfolioAnalysis] = useState<PortfolioAnalysis | null>(null);

  // Load portfolio from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('userPortfolio');
    if (saved) {
      try {
        setPortfolio(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load portfolio", e);
      }
    }
  }, []);

  // Save portfolio to local storage when changed
  useEffect(() => {
    localStorage.setItem('userPortfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const handleAnalysis = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setPortfolioAnalysis(null); // Reset portfolio analysis when fresh market data is fetched
    try {
      const result = await analyzeMarket();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong while fetching the analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handlePortfolioAnalysis = async () => {
    if (!data?.data || portfolio.length === 0) return;
    
    setAnalyzingPortfolio(true);
    try {
      const result = await analyzeUserPortfolio(portfolio, data.data);
      setPortfolioAnalysis(result);
    } catch (err: any) {
      console.error(err);
      // Optional: show a specific error toast for portfolio analysis failure
    } finally {
      setAnalyzingPortfolio(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">A-Share Alpha Insight</h1>
              <p className="text-xs text-slate-500 hidden sm:block">AI-Driven China Stock Market Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleAnalysis}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm
                ${loading 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md active:transform active:scale-95'
                }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin w-4 h-4" />
                  Processing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Generate Analysis
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Intro / Empty State */}
        {!data && !loading && !error && (
          <div className="text-center py-20">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
              <TrendingUp className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-80" />
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Welcome to Alpha Insight</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Click the <span className="font-semibold text-red-600">Generate Analysis</span> button to have our AI agent search 
                real-time global news, US market closures, and Chinese policy updates to predict today's A-share trends.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-8">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <Globe className="w-6 h-6 text-blue-500 mb-2" />
                  <h3 className="font-semibold text-slate-900 text-sm">Global Data</h3>
                  <p className="text-xs text-slate-500 mt-1">Parses US indices & global sentiment.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <ScrollText className="w-6 h-6 text-indigo-500 mb-2" />
                  <h3 className="font-semibold text-slate-900 text-sm">Policy Analysis</h3>
                  <p className="text-xs text-slate-500 mt-1">Interprets PBOC & gov announcements.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <PieChart className="w-6 h-6 text-emerald-500 mb-2" />
                  <h3 className="font-semibold text-slate-900 text-sm">Smart Picks</h3>
                  <p className="text-xs text-slate-500 mt-1">Recommends sectors, ETFs & individual stocks.</p>
                </div>
              </div>

              {/* Portfolio Preview in Empty State */}
              <div className="border-t border-slate-100 pt-8">
                 <h3 className="font-semibold text-slate-800 mb-4 flex items-center justify-center gap-2">
                   <Wallet className="text-emerald-600" size={20}/> My Portfolio Setup
                 </h3>
                 <PortfolioManager portfolio={portfolio} setPortfolio={setPortfolio} />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-2xl mx-auto mt-10">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-800 mb-2">Analysis Failed</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={handleAnalysis} className="text-sm font-semibold text-red-700 hover:text-red-900 underline">Try Again</button>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && (
          <div className="animate-pulse space-y-6 max-w-5xl mx-auto mt-8">
            <div className="h-40 bg-slate-200 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-slate-200 rounded-xl"></div>
              <div className="h-64 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="h-80 bg-slate-200 rounded-xl"></div>
          </div>
        )}

        {/* Results Dashboard */}
        {data && data.data && (
          <div className="space-y-6 animate-fade-in pb-10">
            
            {/* Disclaimer Banner */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700">
                    <span className="font-bold">Disclaimer:</span> The following analysis is generated by AI based on public internet data. It does not constitute professional financial advice. Stock market investments carry risks.
                  </p>
                </div>
              </div>
            </div>

            {/* Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Market Prediction */}
              <AnalysisCard title="今日市场概览 (Market Overview)" icon={<TrendingUp size={20}/>} className="lg:col-span-2">
                <div className="mb-4">
                  <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">Prediction</span>
                  <div className="flex items-center gap-3 mt-1">
                    <h2 className={`text-3xl font-bold ${
                      data.data.prediction === 'Bullish' ? 'text-red-600' :
                      data.data.prediction === 'Bearish' ? 'text-green-600' :
                      'text-amber-600'
                    }`}>
                      {data.data.prediction === 'Bullish' ? '看涨 (Bullish)' :
                       data.data.prediction === 'Bearish' ? '看跌 (Bearish)' :
                       data.data.prediction === 'Neutral' ? '中性 (Neutral)' : '震荡 (Volatile)'}
                    </h2>
                    <span className="text-sm text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{data.data.date}</span>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed text-lg mb-6">{data.data.marketOverview}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                      <Globe size={16} /> 美国市场影响 (US Impact)
                    </h4>
                    <p className="text-sm text-blue-800">{data.data.usMarketImpact}</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                      <ScrollText size={16} /> 政策面分析 (Policy)
                    </h4>
                    <p className="text-sm text-indigo-800">{data.data.policyImpact}</p>
                  </div>
                </div>
              </AnalysisCard>

              {/* Sector Sentiment Chart */}
              <AnalysisCard title="板块热度 (Sector Sentiment)" icon={<PieChart size={20}/>} className="lg:col-span-1">
                <div className="h-full flex flex-col justify-center">
                  <p className="text-xs text-slate-500 mb-4 text-center">Score > 50 indicates bullish sentiment</p>
                  <SectorChart sectors={data.data.sectors} />
                  <div className="mt-4 space-y-2">
                    {data.data.sectors.slice(0, 3).map((sector, idx) => (
                      <div key={idx} className="text-xs border-l-2 pl-2" style={{borderColor: sector.sentiment >= 50 ? '#ef4444' : '#22c55e'}}>
                        <span className="font-bold text-slate-700">{sector.name}</span>
                        <p className="text-slate-500 truncate">{sector.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </AnalysisCard>
            </div>

            {/* PORTFOLIO SECTION */}
            <div className="grid grid-cols-1 gap-6">
              <PortfolioManager portfolio={portfolio} setPortfolio={setPortfolio} />
              
              {/* Only show analyze button if there is a portfolio */}
              {portfolio.length > 0 && !portfolioAnalysis && (
                <div className="flex justify-center">
                   <button
                    onClick={handlePortfolioAnalysis}
                    disabled={analyzingPortfolio}
                    className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                     {analyzingPortfolio ? (
                        <>
                           <RefreshCw className="animate-spin w-5 h-5" />
                           Analyzing Portfolio...
                        </>
                     ) : (
                       <>
                         <Sparkles className="w-5 h-5 text-yellow-400" />
                         Analyze My Portfolio (AI Diagnosis)
                       </>
                     )}
                   </button>
                </div>
              )}

              {/* Portfolio Results */}
              {portfolioAnalysis && (
                <PortfolioReview analysis={portfolioAnalysis} />
              )}
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              
              {/* Top 5 Stocks */}
              <AnalysisCard title="精选个股 Top 5" icon={<ListOrdered size={20}/>}>
                 <StockTable stocks={data.data.topStocks} />
              </AnalysisCard>

              {/* ETF Recommendations */}
              <AnalysisCard title="ETF 基金推荐" icon={<PieChart size={20}/>}>
                <div className="grid grid-cols-1 gap-3">
                  {data.data.recommendedETFs.map((etf, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{etf.name}</span>
                        <span className="text-xs text-slate-500 font-mono">{etf.symbol}</span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {etf.category}
                      </span>
                    </div>
                  ))}
                  {data.data.recommendedETFs.length === 0 && (
                    <p className="text-slate-500 italic text-sm text-center py-4">No specific ETF recommendations today.</p>
                  )}
                </div>
              </AnalysisCard>
            </div>
            
            {/* Grounding Sources */}
            {data.sources && data.sources.length > 0 && (
              <div className="mt-8 border-t border-slate-200 pt-6">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Search size={14} /> Sources & References
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.sources.map((source, idx) => (
                    source.web?.uri ? (
                      <a 
                        key={idx}
                        href={source.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
                      >
                        <span className="truncate max-w-[150px]">{source.web.title || "Source " + (idx + 1)}</span>
                        <ExternalLink size={10} />
                      </a>
                    ) : null
                  ))}
                </div>
              </div>
            )}

            {/* Fallback View if Parsing Failed but we have text */}
            {!data.data && data.rawText && (
               <AnalysisCard title="Raw Analysis" className="mt-6">
                 <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono bg-slate-50 p-4 rounded-lg overflow-x-auto">
                   {data.rawText}
                 </pre>
               </AnalysisCard>
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default App;
