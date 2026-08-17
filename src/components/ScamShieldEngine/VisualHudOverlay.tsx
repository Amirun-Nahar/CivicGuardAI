import React from 'react';
import { BoundingBox } from '../../types';
import { ShieldAlert, Crosshair, AlertCircle, Eye } from 'lucide-react';

interface VisualHudOverlayProps {
  imageSrc?: string | null;
  boundingBoxes?: BoundingBox[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export const VisualHudOverlay: React.FC<VisualHudOverlayProps> = ({
  imageSrc,
  boundingBoxes = [],
  riskLevel,
}) => {
  // Mock phishing image if no user image provided for demo preset
  const displayImage = imageSrc || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="p-5 rounded-2xl bg-[#131924] border border-[#1E2638] shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
        <div className="flex items-center space-x-2">
          <Crosshair className="w-5 h-5 text-crimsondanger-500 animate-spin-slow" />
          <h3 className="font-extrabold text-base text-slate-100 flex items-center space-x-2">
            <span>Gemini Multimodal Bounding Box HUD</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-crimsondanger-500/20 text-rose-400 border border-crimsondanger-500/40">
              HUD Active
            </span>
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Telemetry Canvas Overlay</span>
      </div>

      {/* Main Image HUD Canvas Box */}
      <div className="relative w-full rounded-xl overflow-hidden bg-black/90 border border-crimsondanger-500/40 glow-crimson group min-h-[320px] flex items-center justify-center">
        
        {/* Radar Sweep Effect */}
        <div className="absolute inset-0 radar-sweep opacity-30 pointer-events-none z-10" />

        {/* HUD Target Lines */}
        <div className="absolute inset-0 pointer-events-none z-10 border border-dashed border-crimsondanger-500/20 m-2" />

        <img
          src={displayImage}
          alt="Scam Analysis Target"
          className="w-full h-auto max-h-[450px] object-contain opacity-75 group-hover:opacity-90 transition-opacity"
        />

        {/* Bounding Box Render Loop */}
        {boundingBoxes.map((box, idx) => {
          // Normalize coordinates from 0-1000 to percentages
          const [ymin, xmin, ymax, xmax] = box.box_2d;
          const top = `${(ymin / 1000) * 100}%`;
          const left = `${(xmin / 1000) * 100}%`;
          const width = `${((xmax - xmin) / 1000) * 100}%`;
          const height = `${((ymax - ymin) / 1000) * 100}%`;

          return (
            <div
              key={idx}
              style={{ top, left, width, height }}
              className="absolute z-20 border-2 border-crimsondanger-500 bg-crimsondanger-500/20 rounded-md shadow-lg animate-pulse"
            >
              {/* Corner Targets */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />

              {/* Threat Label Tag */}
              <div className="absolute -top-7 left-0 bg-crimsondanger-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow flex items-center space-x-1 whitespace-nowrap z-30">
                <AlertCircle className="w-3 h-3 text-amber-300" />
                <span>{box.label}</span>
              </div>
            </div>
          );
        })}

        {/* Default Bounding Boxes if none present */}
        {boundingBoxes.length === 0 && (
          <div className="absolute top-1/3 left-1/4 w-1/2 h-1/3 border-2 border-crimsondanger-500 bg-crimsondanger-500/15 rounded-md flex items-center justify-center text-rose-300 text-xs font-bold shadow-lg animate-pulse">
            <span className="bg-crimson-600 px-2 py-1 rounded">⚠️ Suspicious Domain & Urgency Vector Detected</span>
          </div>
        )}
      </div>

      {/* Bounding Boxes Legend */}
      {boundingBoxes.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-300 block">Identified Threat Overlay Rectangles:</span>
          <div className="flex flex-wrap gap-2">
            {boundingBoxes.map((box, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-crimsondanger-500/10 text-rose-300 border border-crimsondanger-500/30 text-xs font-semibold flex items-center space-x-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-crimsondanger-500 animate-ping" />
                <span>{box.label}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
