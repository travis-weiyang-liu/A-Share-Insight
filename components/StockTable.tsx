import React from 'react';
import { Stock } from '../types';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle } from 'lucide-react';

interface StockTableProps {
  stocks: Stock[];
}

export const StockTable: React.FC<StockTableProps> = ({ stocks }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">代码 (Code)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">名称 (Name)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">推荐理由 (Reason)</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">趋势 (Trend)</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {stocks.map((stock, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-mono font-medium text-slate-700">{stock.symbol}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-slate-900">{stock.name}</td>
              <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate" title={stock.reason}>{stock.reason}</td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${stock.expectedTrend === 'Up' ? 'bg-red-100 text-red-800' : 
                    stock.expectedTrend === 'Down' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                  {stock.expectedTrend === 'Up' && <ArrowUpCircle size={14} />}
                  {stock.expectedTrend === 'Down' && <ArrowDownCircle size={14} />}
                  {stock.expectedTrend === 'Neutral' && <MinusCircle size={14} />}
                  {stock.expectedTrend}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};