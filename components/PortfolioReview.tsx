import React from 'react';
import { PortfolioAnalysis } from '../types';
import { AlertCircle, TrendingUp, TrendingDown, Minus, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PortfolioReviewProps {
  analysis: PortfolioAnalysis;
}

export const PortfolioReview: React.FC<PortfolioReviewProps> = ({ analysis }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Buy': case 'Add': return <TrendingUp size={16} className="text-red-500" />;
      case 'Sell': case 'Reduce': return <TrendingDown size={16} className="text-green-500" />;
      default: return <Minus size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center gap-2">
        <ShieldAlert className="text-yellow-400" />
        <h3 className="font-semibold text-white text-lg">AI 持仓诊断 (Portfolio Diagnosis)</h3>
      </div>

      <div className="p-6">
        {/* Summary Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className={`flex-shrink-0 px-6 py-4 rounded-lg border flex flex-col items-center justify-center min-w-[140px] ${getRiskColor(analysis.overallRisk)}`}>
            <span className="text-xs uppercase font-bold tracking-wider opacity-80">风险等级</span>
            <span className="text-2xl font-bold mt-1">{analysis.overallRisk} Risk</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">综合点评 Summary</h4>
            <p className="text-slate-600 leading-relaxed">{analysis.summary}</p>
          </div>
        </div>

        {/* Holdings Advice Table */}
        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">个股操作建议 Holdings Analysis</h4>
        <div className="overflow-x-auto border border-slate-200 rounded-lg mb-8">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">标的</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">建议操作</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">风险</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">理由</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {analysis.holdingsAdvice.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-slate-800">{item.symbol}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1.5 font-medium text-sm text-slate-700">
                      {getActionIcon(item.action)}
                      <span>{item.action === 'Buy' ? '买入' : item.action === 'Sell' ? '卖出' : item.action === 'Hold' ? '持有' : item.action === 'Reduce' ? '减仓' : '加仓'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      item.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                      item.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 max-w-md">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Suggested Adjustments */}
        {analysis.suggestedAdjustments && analysis.suggestedAdjustments.length > 0 && (
          <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100">
            <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} /> 调仓建议 Adjustments
            </h4>
            <ul className="space-y-2">
              {analysis.suggestedAdjustments.map((adj, idx) => (
                <li key={idx} className="flex items-start gap-2 text-indigo-800 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                  <span>{adj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
