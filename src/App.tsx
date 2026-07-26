import React, { useState, useRef } from 'react';
import * as tmImage from '@teachablemachine/image';
import { Camera, Upload, Loader2, Info, RefreshCcw, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/o6D3WQyx4/';

export default function App() {
  const [model, setModel] = useState<any | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [predictions, setPredictions] = useState<{ className: string; probability: number }[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (imageURL) {
      URL.revokeObjectURL(imageURL);
    }

    const url = URL.createObjectURL(file);
    setImageURL(url);
    setPredictions([]);
    setIsInitializing(true);
  };

  const handleImageLoad = async () => {
    if (!imageRef.current) return;
    
    try {
      let currentModel = model;
      if (!currentModel) {
        const modelURL = MODEL_URL + 'model.json';
        const metadataURL = MODEL_URL + 'metadata.json';
        currentModel = await tmImage.load(modelURL, metadataURL);
        setModel(currentModel);
      }
      
      const prediction = await currentModel.predict(imageRef.current);
      const sortedPredictions = [...prediction].sort((a, b) => b.probability - a.probability);
      setPredictions(sortedPredictions);
    } catch (error) {
      console.error('Error during prediction:', error);
      alert('이미지 분석 중 오류가 발생했습니다.');
    } finally {
      setIsInitializing(false);
    }
  };

  const resetTest = () => {
    if (imageURL) {
      URL.revokeObjectURL(imageURL);
    }
    setImageURL(null);
    setPredictions([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getTopPrediction = () => {
    if (predictions.length === 0) return null;
    return predictions[0];
  };

  const topPrediction = getTopPrediction();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
              🐶🐱
            </div>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight">강아지상 vs 고양이상</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">AI가 분석하는 나의 얼굴상</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
        <div className="w-full text-center space-y-4 mb-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            나는 강아지상일까?<br className="sm:hidden" /> 고양이상일까?
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            사진을 업로드하면 인공지능 모델이 당신의 얼굴상을 분석합니다.
          </p>
        </div>

        <div className="w-full max-w-sm mx-auto relative">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Image Container */}
          <div className="relative aspect-square w-full rounded-3xl bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center mb-8">
            {imageURL ? (
              <img
                ref={imageRef}
                src={imageURL}
                alt="Uploaded face"
                onLoad={handleImageLoad}
                className="w-full h-full object-cover z-10"
                crossOrigin="anonymous"
              />
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex flex-col items-center justify-center z-0 text-slate-400 dark:text-slate-500 gap-4 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                <ImageIcon className="w-16 h-16 opacity-50" />
                <span className="font-medium">사진 업로드하기</span>
              </div>
            )}
            
            <AnimatePresence>
              {isInitializing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white"
                >
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-amber-400" />
                  <span className="font-bold">AI 모델 로딩 및 분석 중...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-8">
            {!imageURL ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 px-6 rounded-2xl font-black text-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                사진 선택하기
              </button>
            ) : (
              <button
                onClick={resetTest}
                className="w-full py-4 px-6 rounded-2xl font-bold text-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-md hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-5 h-5" />
                다른 사진으로 테스트
              </button>
            )}
          </div>

          {/* Results */}
          <AnimatePresence>
            {predictions.length > 0 && topPrediction && !isInitializing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-5"
              >
                <div className="text-center space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">당신의 얼굴상은</h3>
                  <div className="text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
                    {topPrediction.className}
                  </div>
                </div>

                <div className="space-y-4">
                  {predictions.map((p, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-slate-700 dark:text-slate-300">{p.className}</span>
                        <span className="text-slate-900 dark:text-white">{(p.probability * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full ${idx === 0 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${p.probability * 100}%` }}
                          transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!imageURL && (
             <div className="bg-slate-100 dark:bg-slate-900/60 rounded-2xl p-4 flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
               <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
               <p>업로드된 사진은 서버로 전송되지 않으며, 기기 내에서만 안전하게 분석됩니다.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
