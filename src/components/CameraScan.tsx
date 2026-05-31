"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, Scan, Loader2, Sparkles } from "lucide-react";
import { analyzeInventory } from "@/app/actions/ai-scan";
import { useBooking } from "@/lib/booking-context";
import { useRouter } from "next/navigation";

interface CameraScanProps {
  onClose: () => void;
}

export default function CameraScan({ onClose }: CameraScanProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { updateState } = useBooking();
  const router = useRouter();

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Could not access camera. Please check permissions.");
      }
    }
    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/jpeg");

    try {
      const result = await analyzeInventory(imageData, "image/jpeg");
      
      if (result.items) {
        updateState({ 
          items: result.items.map((i: any) => ({
            category: i.category || "Furniture",
            name: i.name,
            quantity: i.quantity,
            isFragile: i.isFragile,
            volume: i.m3
          })),
          aiEstimatedVolume: result.totalVolume,
          step: 3
        });
        
        // Save to "AI Insights" local storage for the dashboard
        const currentStats = JSON.parse(localStorage.getItem("ai_insights") || '{"items":0, "volume":0, "fragile":0}');
        localStorage.setItem("ai_insights", JSON.stringify({
          items: currentStats.items + result.items.length,
          volume: currentStats.volume + result.totalVolume,
          fragile: currentStats.fragile + result.items.filter((i: any) => i.isFragile).length
        }));

        router.push("/book");
      }
    } catch (err: any) {
      setError(err.message || "AI Analysis failed");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white/40 backdrop-blur-3xl flex flex-col items-center justify-center animate-fade-in">
      {/* Video Stream Container */}
      <div className="relative w-full h-[85vh] max-w-lg overflow-hidden flex items-center justify-center rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(204,102,153,0.15)] bg-white/50 border border-brand-500/10">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover"
        />
        
        {/* Scanning Overlay Grid - Refined & Brand Styled */}
        <div className="absolute inset-0 border-[40px] border-white/20 pointer-events-none">
          <div className="w-full h-full border-2 border-brand-500/30 relative overflow-hidden">
            {/* Pulsing Scan Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-500 shadow-[0_0_30px_rgba(204,102,153,1)] animate-scan-line"></div>
            
            {/* Corners - Premium Tactile Style */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-brand-600 rounded-tl-[2rem] shadow-[0_0_20px_rgba(204,102,153,0.3)]"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-brand-600 rounded-tr-[2rem] shadow-[0_0_20px_rgba(204,102,153,0.3)]"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-brand-600 rounded-bl-[2rem] shadow-[0_0_20px_rgba(204,102,153,0.3)]"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-brand-600 rounded-br-[2rem] shadow-[0_0_20px_rgba(204,102,153,0.3)]"></div>

            {/* AI Scanning Particles */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute w-2 h-2 bg-brand-500 rounded-full animate-float-slow blur-[1px]" style={{ top: '20%', left: '30%' }}></div>
              <div className="absolute w-3 h-3 bg-brand-400 rounded-full animate-float-fast blur-[1px]" style={{ top: '60%', left: '70%' }}></div>
              <div className="absolute w-2 h-2 bg-brand-600 rounded-full animate-float-medium blur-[1px]" style={{ top: '40%', left: '50%' }}></div>
            </div>
          </div>
        </div>

        {/* Header Instructions - Glass Light */}
        <div className="absolute top-12 left-0 right-0 text-center px-6 animate-slide-down">
          <div className="inline-flex items-center gap-3 glass-light px-8 py-4 rounded-full border border-brand-500/20 shadow-2xl">
            <div className="w-3 h-3 rounded-full bg-brand-500 animate-pulse ring-4 ring-brand-500/20" />
            <span className="text-surface-900 text-[11px] font-black uppercase tracking-[0.2em]">MoveMate Vision Ready</span>
          </div>
          <p className="text-surface-900/90 text-[9px] font-black uppercase tracking-[0.3em] mt-4">Calibrating cargo sectors...</p>
        </div>

        {/* Capture Control - Floating Bar Style */}
        <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-8 px-10">
          <button 
            onClick={onClose}
            className="w-16 h-16 rounded-[2rem] glass-light flex items-center justify-center border border-brand-500/10 text-brand-600 hover:text-brand-700 transition-all hover:bg-white shadow-xl btn-tactile"
          >
            <X size={28} strokeWidth={3} />
          </button>
          
          <button 
            onClick={handleCapture}
            disabled={isAnalyzing}
            className="group relative"
          >
            <div className="absolute inset-0 bg-brand-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="w-28 h-28 rounded-full border-4 border-white flex items-center justify-center p-1.5 relative overflow-hidden glass-light shadow-2xl btn-tactile">
              <div className={`w-full h-full rounded-full bg-brand-500 flex items-center justify-center shadow-2xl transition-all duration-700 ${isAnalyzing ? 'scale-0' : 'group-hover:scale-95 group-active:scale-90 scale-100'}`}>
                <Camera size={40} className="text-white" strokeWidth={2.5} />
              </div>
              {isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={48} className="text-brand-500 animate-pulse" />
                </div>
              )}
            </div>
          </button>

          <div className="w-16 h-16 glass-light rounded-[2rem] flex items-center justify-center border border-brand-500/10 text-brand-600 shadow-xl group/info">
            <Scan size={28} strokeWidth={3} className="group-hover/info:rotate-90 transition-transform" />
          </div>
        </div>

        {/* Analysis Status Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 glass-light backdrop-blur-md flex flex-col items-center justify-center animate-fade-in z-20">
            <div className="w-24 h-24 relative mb-8">
              <div className="absolute inset-0 border-4 border-brand-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={40} className="text-brand-500 animate-pulse" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-surface-900 tracking-tighter uppercase mb-2">Neural Scan</h3>
            <p className="text-brand-500/60 text-[10px] font-black uppercase tracking-[0.3em]">Processing spatial metadata</p>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {error && (
        <div className="fixed bottom-12 left-6 right-6 glass-light shadow-[0_40px_80px_rgba(239,68,68,0.1)] border-red-500/20 p-8 rounded-[2.5rem] flex items-center gap-6 animate-slide-up">
          <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
            <X size={24} strokeWidth={3} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-black text-surface-900 uppercase tracking-widest leading-tight">{error}</p>
            <button onClick={() => { setError(null); setIsAnalyzing(false); }} className="text-brand-600 text-[10px] font-black uppercase tracking-[0.2em] mt-2 hover:text-brand-700 transition-colors">Re-attempt Scan</button>
          </div>
        </div>
      )}
    </div>
  );
}
