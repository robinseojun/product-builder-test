import React, { useState, useEffect, useRef } from 'react';
import * as tmImage from '@teachablemachine/image';
import { Camera, RefreshCcw, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const URL = 'https://teachablemachine.withgoogle.com/models/o6D3WQyx4/';

export default function App() {
  const [model, setModel] = useState<any | null>(null);
  const [webcam, setWebcam] = useState<any | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [predictions, setPredictions] = useState<{ className: string; probability: number }[]>([]);
  const webcamContainerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (webcam) {
        webcam.stop();
      }
    };
  }, [webcam]);

  const init = async () => {
    if (isInitializing || isPlaying) return;
    setIsInitializing(true);
    try {
      const modelURL = URL + 'model.json';
      const metadataURL = URL + 'metadata.json';

      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);

      const flip = true;
      const tmWebcam = new tmImage.Webcam(300, 300, flip);
      await tmWebcam.setup();
      await tmWebcam.play();
      
      setWebcam(tmWebcam);
      setIsPlaying(true);

      if (webcamContainerRef.current) {
        webcamContainerRef.current.innerHTML = '';
        webcamContainerRef.current.appendChild(tmWebcam.canvas);
        
        // Add Tailwind classes to canvas
        tmWebcam.canvas.classList.add('w-full', 'h-full', 'object-cover', 'rounded-2xl', 'shadow-xl');
      }

      window.requestAnimationFrame(() => loop(tmWebcam, loadedModel));
    } catch (error) {
      console.error('Error initializing Teachable Machine:', error);
      alert('웹캠을 초기화하는 중 오류가 발생했습니다. 카메라 권한을 확인해주세요.');
    } finally {
      setIsInitializing(false);
    }
  };

  const loop = async (currentWebcam: any, currentModel: any) => {
    currentWebcam.update();
    await predict(currentWebcam, currentModel);
    requestRef.current = window.requestAnimationFrame(() => loop(currentWebcam, currentModel));
  };

  const predict = async (currentWebcam: any, currentModel: any) => {
    const prediction = await currentModel.predict(currentWebcam.canvas);
    // Sort predictions by probability descending
    const sortedPredictions = [...prediction].sort((a, b) => b.probability - a.probability);
    setPredictions(sortedPredictions);
  };

  const stopWebcam = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (webcam) {
      webcam.stop();
      setWebcam(null);
    }
    if (webcamContainerRef.current) {
      webcamContainerRef.current.innerHTML = '';
    }
    setIsPlaying(false);
    setPredictions([]);
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
            인공지능 모델이 웹캠을 통해 실시간으로 당신의 얼굴상을 분석합니다.
          </p>
        </div>

        <div className="w-full max-w-sm mx-auto relative">
          {/* Webcam Container */}
          <div className="relative aspect-square w-full rounded-3xl bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center mb-8">
            <div 
              ref={webcamContainerRef} 
              className="absolute inset-0 w-full h-full flex items-center justify-center z-10" 
            />
            
            {!isPlaying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-0 text-slate-400 dark:text-slate-500 gap-4">
                <Camera className="w-16 h-16 opacity-50" />
                <span className="font-medium">카메라를 켜주세요</span>
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
                  <span className="font-bold">AI 모델 로딩 중...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-8">
            {!isPlaying ? (
              <button
                onClick={init}
                disabled={isInitializing}
                className="w-full py-4 px-6 rounded-2xl font-black text-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    준비 중...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    테스트 시작하기
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={stopWebcam}
                className="w-full py-4 px-6 rounded-2xl font-bold text-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-md hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-5 h-5" />
                테스트 종료
              </button>
            )}
          </div>

          {/* Results */}
          <AnimatePresence>
            {isPlaying && topPrediction && (
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
          
          {!isPlaying && (
             <div className="bg-slate-100 dark:bg-slate-900/60 rounded-2xl p-4 flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
               <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
               <p>입력된 영상은 외부 서버로 전송되지 않으며, 사용자의 브라우저(기기) 내에서만 실시간으로 분석됩니다.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
