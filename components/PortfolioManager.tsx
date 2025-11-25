import React, { useState } from 'react';
import { PortfolioItem } from '../types';
import { Plus, Trash2, Edit2, Wallet, Save, X } from 'lucide-react';

interface PortfolioManagerProps {
  portfolio: PortfolioItem[];
  setPortfolio: (items: PortfolioItem[]) => void;
}

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({ portfolio, setPortfolio }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Omit<PortfolioItem, 'id'>>({ symbol: '', name: '', cost: 0, shares: 0 });

  const handleAdd = () => {
    if (!newItem.symbol || !newItem.name) return;
    const item: PortfolioItem = {
      ...newItem,
      id: Date.now().toString(),
    };
    setPortfolio([...portfolio, item]);
    setNewItem({ symbol: '', name: '', cost: 0, shares: 0 });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setPortfolio(portfolio.filter(p => p.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="text-emerald-600" />
          <h3 className="font-semibold text-slate-800 text-lg">我的持仓 (My Portfolio)</h3>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 text-sm bg-slate-800 text-white px-3 py-1.5 rounded-md hover:bg-slate-700 transition-colors"
        >
          {isAdding ? <X size={16} /> : <Plus size={16} />}
          {isAdding ? '取消' : '添加持仓'}
        </button>
      </div>

      <div className="p-0">
        {isAdding && (
          <div className="bg-slate-50 p-4 border-b border-slate-200 grid grid-cols-1 md:grid-cols-5 gap-3 items-end animate-fade-in">
            <div className="col-span-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">代码 (Code)</label>
              <input 
                type="text" 
                placeholder="600519"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newItem.symbol}
                onChange={e => setNewItem({...newItem, symbol: e.target.value})}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">名称 (Name)</label>
              <input 
                type="text" 
                placeholder="贵州茅台"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newItem.name}
                onChange={e => setNewItem({...newItem, name: e.target.value})}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">成本 (Cost)</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newItem.cost}
                onChange={e => setNewItem({...newItem, cost: parseFloat(e.target.value)})}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">股数 (Shares)</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newItem.shares}
                onChange={e => setNewItem({...newItem, shares: parseFloat(e.target.value)})}
              />
            </div>
            <button 
              onClick={handleAdd}
              className="col-span-1 bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 flex justify-center items-center gap-2"
            >
              <Save size={16} /> 保存
            </button>
          </div>
        )}

        {portfolio.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            暂无持仓信息，请点击右上角添加。<br/> Add your stocks to get personalized AI analysis.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">代码</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">名称</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">持仓成本</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">持股数</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {portfolio.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600">{item.symbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-600">¥{item.cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-600">{item.shares}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
