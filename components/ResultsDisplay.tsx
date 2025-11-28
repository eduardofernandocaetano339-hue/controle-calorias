import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AnalysisResponse } from '../types';
import { AlertCircle, ChevronDown, ChevronUp, Zap, Utensils } from 'lucide-react';

interface ResultsDisplayProps {
  data: AnalysisResponse;
  imageUri: string;
  onReset: () => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ConfidenceBadge: React.FC<{ score: number }> = ({ score }) => {
  let color = 'bg-red-100 text-red-700 border-red-200';
  let label = 'Baixa Precisão';
  
  if (score > 0.8) {
    color = 'bg-emerald-100 text-emerald-700 border-emerald-200';
    label = 'Alta Precisão';
  } else if (score > 0.5) {
    color = 'bg-amber-100 text-amber-700 border-amber-200';
    label = 'Média Precisão';
  }

  return (
    <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${color}`}>
      {label}
    </span>
  );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, imageUri, onReset }) => {
  const [showReasoning, setShowReasoning] = useState(false);

  // Prepare chart data
  const chartData = data.food_items.map(item => ({
    name: item.name,
    value: item.calories
  }));

  return (
    <div className="w-full animate-fade-in pb-20">
      
      {/* Header Image Card - Expanded */}
      <div className="relative w-full h-80 sm:h-96 rounded-[2rem] overflow-hidden shadow-2xl mb-8 group transition-all duration-500">
        <img 
          src={`data:image/jpeg;base64,${imageUri}`} 
          alt="Comida Analisada" 
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 sm:p-10">
          <p className="text-slate-300 text-base font-medium mb-1 uppercase tracking-wide">Energia Total Estimada</p>
          <div className="flex items-baseline gap-3">
            <h1 className="text-7xl sm:text-8xl font-bold text-white tracking-tighter">
              {data.total_calories}
            </h1>
            <span className="text-3xl text-emerald-400 font-medium">kcal</span>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                 <div className="h-2 w-32 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${data.overall_confidence > 0.7 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${data.overall_confidence * 100}%` }}
                    />
                 </div>
                 <span className="text-sm font-medium text-white/90">{Math.round(data.overall_confidence * 100)}% Precisão Visual</span>
              </div>
          </div>
        </div>
        <button 
            onClick={onReset}
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors border border-white/20 shadow-lg"
        >
            Nova Análise
        </button>
      </div>

      {/* Main Stats Grid - Expanded */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Calorie Breakdown Chart */}
        <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-widest mb-6 w-full text-left flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-500" />
                Distribuição Calórica
            </h3>
            <div className="h-72 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={125}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={1500}
                    animationBegin={200}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Inter', padding: '12px' }}
                    itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                    formatter={(value: number) => [`${value} kcal`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text in Donut */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center animate-in fade-in zoom-in duration-1000">
                    <span className="block text-4xl font-bold text-slate-800">{data.food_items.length}</span>
                    <span className="text-xs text-slate-400 uppercase font-semibold">Itens</span>
                 </div>
              </div>
            </div>
            <div className="w-full mt-6 flex flex-wrap justify-center gap-3">
                {chartData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 hover:bg-slate-100 transition-colors">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-xs font-medium text-slate-600 max-w-[150px] truncate">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Item List */}
        <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100">
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-widest mb-6">Itens Detectados</h3>
          <div className="space-y-6">
            {data.food_items.map((item, idx) => (
              <div key={idx} className="group flex flex-col border-b border-slate-100 last:border-0 pb-5 last:pb-0 hover:bg-slate-50/50 p-3 -mx-2 rounded-xl transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start gap-4">
                        <div className="w-4 h-4 rounded-full mt-1.5 shrink-0 shadow-sm ring-2 ring-white" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <div>
                            <h4 className="text-lg font-bold text-slate-800 leading-tight">{item.name}</h4>
                            <p className="text-sm text-slate-500 font-medium mt-1">{item.portion_estimate}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-black text-slate-800">{item.calories} <span className="text-sm font-semibold text-slate-400">kcal</span></div>
                        <div className="mt-1">
                             <ConfidenceBadge score={item.confidence_score} />
                        </div>
                    </div>
                </div>
                
                {item.macronutrients && (
                    <div className="flex gap-6 pl-8 mt-2">
                         <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Prot</span>
                            <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{item.macronutrients.protein}</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Carb</span>
                            <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{item.macronutrients.carbs}</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Gord</span>
                            <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{item.macronutrients.fat}</span>
                         </div>
                    </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Uncertainty & Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
         <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-amber-100 rounded-full">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-lg text-amber-900">Pontos de Atenção</h3>
            </div>
            <ul className="space-y-3">
                {data.uncertainty_factors.map((factor, i) => (
                    <li key={i} className="text-base text-amber-800/80 flex items-start gap-3 leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        {factor}
                    </li>
                ))}
            </ul>
         </div>

         <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-100 rounded-full">
                    <Zap className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg text-emerald-900">Dicas de Nutrição</h3>
            </div>
            <ul className="space-y-3">
                {data.health_tips.map((tip, i) => (
                    <li key={i} className="text-base text-emerald-800/80 flex items-start gap-3 leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        {tip}
                    </li>
                ))}
            </ul>
         </div>
      </div>

      {/* Expandable Reasoning */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <button 
            onClick={() => setShowReasoning(!showReasoning)}
            className="w-full flex items-center justify-between p-6 text-slate-600 hover:bg-slate-50 transition-colors"
        >
            <span className="font-semibold text-base">Ver Lógica da Inteligência Artificial</span>
            {showReasoning ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {showReasoning && (
            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                <div className="prose prose-slate max-w-none">
                    <ol className="list-decimal pl-5 space-y-3 text-slate-600">
                        {data.step_by_step_reasoning.map((step, i) => (
                            <li key={i} className="leading-relaxed text-base">{step}</li>
                        ))}
                    </ol>
                </div>
            </div>
        )}
      </div>

    </div>
  );
};