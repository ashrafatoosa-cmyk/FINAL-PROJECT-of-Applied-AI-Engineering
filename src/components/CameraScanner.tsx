"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera, X, Loader2, CheckCircle2, Box, AlertTriangle,
  ScanLine, RefreshCw, VideoOff
} from "lucide-react";
import { analyzeInventory } from "@/app/actions/ai-scan";

export interface DetectedItem {
  name: string;
  category: string;
  quantity: number;
  isFragile: boolean;
  m3: number;
}

export interface ScanResult {
  items: DetectedItem[];
  totalVolume: number;
  summary: string;
}

interface CameraScannerProps {
  onScanComplete: (result: ScanResult) => void;
  onClose: () => void;
}

type ScanStep = "camera" | "scanning" | "results" | "error";

export default function CameraScanner({ onScanComplete, onClose }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [step, setStep] = useState<ScanStep>("camera");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  // ── Start camera stream ──
  const startCamera = useCallback(async () => {
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Rear camera preferred
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraReady(true);
        };
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (err.name === "NotAllowedError") {
        setErrorMsg("Camera permission denied. Please allow camera access in your browser settings and try again.");
      } else if (err.name === "NotFoundError") {
        setErrorMsg("No camera found on this device. Please connect a camera and try again.");
      } else {
        setErrorMsg(`Could not access camera: ${err.message}`);
      }
      setStep("error");
    }
  }, []);

  // ── Initialize camera on mount ──
  useEffect(() => {
    startCamera();

    return () => {
      // Cleanup stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [startCamera]);

  // ── Capture photo from video feed ──
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const base64Data = canvas.toDataURL("image/jpeg", 0.85);

    // Move to scanning state
    setStep("scanning");
    setProgress(0);

    // Animate progress bar while AI processes
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90; // Cap at 90 until real result comes
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 400);

    try {
      const result = await analyzeInventory(base64Data, "image/jpeg");

      clearInterval(progressInterval);
      setProgress(100);

      const scanData: ScanResult = {
        items: result.items || [],
        totalVolume: result.totalVolume || 0,
        summary: result.summary || "Scan complete.",
      };

      setScanResult(scanData);

      // Brief delay for the progress bar to hit 100
      setTimeout(() => setStep("results"), 400);
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error("AI scan failed:", err);
      setErrorMsg(err.message || "AI analysis failed. Please try again.");
      setStep("error");
    }
  }, []);

  // ── Reset to camera view ──
  const retryCapture = useCallback(() => {
    setStep("camera");
    setProgress(0);
    setErrorMsg("");
    setScanResult(null);
    startCamera();
  }, [startCamera]);

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col font-sans overflow-hidden">
      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── Top Bar ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-5 z-30 bg-gradient-to-b from-black/70 to-transparent">
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
        >
          <X size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${step === "camera" && cameraReady ? "bg-green-400" : step === "scanning" ? "bg-amber-400" : step === "results" ? "bg-brand-400" : "bg-red-400"} animate-pulse`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
            {step === "camera"
              ? cameraReady ? "Camera Active" : "Starting Camera..."
              : step === "scanning"
              ? "AI Processing..."
              : step === "results"
              ? "Scan Complete"
              : "Error"}
          </span>
        </div>
      </div>

      {/* ── Camera Feed / Main Area ── */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Live Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${step !== "camera" ? "blur-md brightness-50" : ""} transition-all duration-500`}
        />

        {/* Dark gradient overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none z-10" />

        {/* ── Camera Viewfinder ── */}
        {step === "camera" && cameraReady && (
          <div className="relative z-20 w-72 h-72 border-2 border-white/20 rounded-3xl flex items-center justify-center animate-fade-in">
            {/* Corner brackets */}
            <div className="absolute -top-1 -left-1 w-10 h-10 border-t-[3px] border-l-[3px] border-accent-500 rounded-tl-3xl" />
            <div className="absolute -top-1 -right-1 w-10 h-10 border-t-[3px] border-r-[3px] border-accent-500 rounded-tr-3xl" />
            <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-[3px] border-l-[3px] border-accent-500 rounded-bl-3xl" />
            <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-[3px] border-r-[3px] border-accent-500 rounded-br-3xl" />
            <ScanLine size={40} className="text-white/15" />
          </div>
        )}

        {/* ── Camera Loading ── */}
        {step === "camera" && !cameraReady && (
          <div className="relative z-20 flex flex-col items-center gap-4 animate-fade-in">
            <Loader2 size={32} className="text-white/50 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Initializing Camera...
            </p>
          </div>
        )}

        {/* ── Scanning Overlay ── */}
        {step === "scanning" && (
          <div className="relative z-20 flex flex-col items-center gap-6 animate-fade-in">
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-4 border-white/10 flex items-center justify-center">
                <Loader2 size={36} className="text-accent-500 animate-spin" />
              </div>
            </div>

            <div className="w-52 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-500 to-brand-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
              Gemini AI Analyzing... {Math.min(progress, 100)}%
            </p>
          </div>
        )}

        {/* ── Results Card ── */}
        {step === "results" && scanResult && (
          <div className="relative z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-7 rounded-3xl flex flex-col gap-4 text-center max-w-sm mx-6 animate-slide-up shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} className="text-brand-400" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Scan Complete</h2>
            <p className="text-xs text-white/60 font-medium leading-relaxed">{scanResult.summary}</p>

            <div className="w-full h-px bg-white/10" />

            {/* Detected items list */}
            <div className="flex flex-col gap-2 text-left max-h-40 overflow-y-auto">
              {scanResult.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-white/80 font-semibold flex items-center gap-2">
                    <Box size={12} className="text-accent-400" />
                    {item.quantity}x {item.name}
                    {item.isFragile && (
                      <AlertTriangle size={10} className="text-amber-400" />
                    )}
                  </span>
                  <span className="text-white/40 font-bold">{item.m3.toFixed(2)} m³</span>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-white/10" />

            <div className="flex justify-between text-xs font-black uppercase tracking-widest">
              <span className="text-white/50">Total Volume</span>
              <span className="text-accent-400">{scanResult.totalVolume.toFixed(1)} m³</span>
            </div>
          </div>
        )}

        {/* ── Error State ── */}
        {step === "error" && (
          <div className="relative z-20 bg-white/10 backdrop-blur-xl border border-red-500/20 p-8 rounded-3xl flex flex-col items-center gap-4 text-center max-w-sm mx-6 animate-slide-up">
            <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
              <VideoOff size={28} className="text-red-400" />
            </div>
            <h2 className="text-lg font-black text-white uppercase tracking-wide">Something Went Wrong</h2>
            <p className="text-xs text-white/60 font-medium leading-relaxed">{errorMsg}</p>
            <button
              onClick={retryCapture}
              className="mt-2 px-6 py-3 rounded-xl bg-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        )}
      </div>

      {/* ── Bottom Controls ── */}
      <div className="p-6 pb-10 bg-gradient-to-t from-black via-black/80 to-transparent relative z-20 flex flex-col items-center justify-center min-h-[160px]">
        {step === "camera" && cameraReady && (
          <div className="flex flex-col items-center gap-3 animate-fade-in">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 text-center">
              Point camera at your furniture & tap to capture
            </p>
            <button
              onClick={capturePhoto}
              className="w-[72px] h-[72px] rounded-full border-4 border-white/30 p-1 hover:scale-105 hover:border-accent-500 transition-all active:scale-95"
            >
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-black">
                <Camera size={22} />
              </div>
            </button>
          </div>
        )}

        {step === "results" && scanResult && (
          <div className="w-full max-w-sm flex flex-col gap-2.5 animate-slide-up">
            <button
              onClick={() => onScanComplete(scanResult)}
              className="w-full py-4 rounded-2xl bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_8px_32px_rgba(34,197,94,0.3)] hover:-translate-y-0.5 transition-all"
            >
              Continue to Booking
            </button>
            <button
              onClick={retryCapture}
              className="w-full py-3.5 rounded-2xl bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Scan Again
            </button>
          </div>
        )}

        {step === "error" && (
          <button
            onClick={onClose}
            className="w-full max-w-sm py-3.5 rounded-2xl bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
