import React, { useState } from 'react';
import { CameraInput } from './components/CameraInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import { analyzeImage } from './services/geminiService';
import { AppState } from './types';
import { ScanLine, Loader2, Utensils, Info } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    imageUri: null,
    isAnalyzing: false,
    result: null,
    error: null,
  });

  const handleImageSelected = async (base64: string) => {
    setState({
      imageUri: base64,
      isAnalyzing: true,
      result: null,
      error: null,
    });

    try {
      const analysis = await analyzeImage(base64);
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        result: analysis,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: "Falha ao analisar a imagem. Tente novamente ou use uma foto mais clara.",
      }));
    }
  };

  const handleReset = () => {
    setState({
      imageUri: null,
      isAnalyzing: false,
      result: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-6 py-5 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
              <Utensils className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">NutriVision <span className="text-emerald-600">AI</span></h1>
          </div>
          <button className="text-slate-400 hover:text-emerald-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
            <Info className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pt-12 pb-32 flex-1 w-full">
        
        {/* State: Initial / Upload */}
        {!state.imageUri && !state.isAnalyzing && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                Controle suas calorias<br/>com apenas uma foto.
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-lg mx-auto">
                Tire uma foto da sua refeição. Nossa Inteligência Artificial identifica os ingredientes e estima as porções instantaneamente.
              </p>
            </div>
            
            <div className="bg-white p-3 rounded-[2rem] shadow-2xl shadow-emerald-900/10 mb-12 rotate-1 hover:rotate-0 transition-transform duration-700 ease-out max-w-xl w-full">
                 <img src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80" alt="Exemplo de Refeição Saudável" className="rounded-[1.5rem] w-full" />
            </div>

            <div className="max-w-lg w-full">
                <CameraInput onImageSelected={handleImageSelected} />
            </div>
          </div>
        )}

        {/* State: Analyzing */}
        {state.isAnalyzing && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="bg-white p-8 rounded-full shadow-xl relative z-10">
                    <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Analisando sua refeição...</h3>
            <p className="text-slate-500 mb-8">Isso pode levar alguns segundos.</p>
            
            <div className="flex flex-col gap-4 w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 text-slate-600 animate-pulse delay-75">
                    <div className="bg-emerald-50 p-2 rounded-lg"><ScanLine className="w-5 h-5 text-emerald-600" /></div>
                    <span className="font-medium">Identificando ingredientes</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600 animate-pulse delay-150">
                    <div className="bg-blue-50 p-2 rounded-lg"><ScanLine className="w-5 h-5 text-blue-600" /></div>
                    <span className="font-medium">Estimando volumes e porções</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600 animate-pulse delay-300">
                    <div className="bg-purple-50 p-2 rounded-lg"><ScanLine className="w-5 h-5 text-purple-600" /></div>
                    <span className="font-medium">Calculando macronutrientes</span>
                </div>
            </div>
          </div>
        )}

        {/* State: Error */}
        {state.error && (
          <div className="max-w-md mx-auto bg-red-50 border border-red-100 rounded-[2rem] p-8 text-center animate-in fade-in zoom-in shadow-lg shadow-red-500/5 mt-10">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                <Info className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-3">Falha na Análise</h3>
            <p className="text-red-600/80 mb-8 text-base leading-relaxed">{state.error}</p>
            <button 
                onClick={handleReset}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-red-600/20 active:scale-95 transition-all"
            >
                Tentar Novamente
            </button>
          </div>
        )}

        {/* State: Result */}
        {state.result && state.imageUri && (
          <ResultsDisplay 
            data={state.result} 
            imageUri={state.imageUri} 
            onReset={handleReset} 
          />
        )}

      </main>
    </div>
  );
};

export default App;