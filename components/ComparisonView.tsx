import React, { useState } from 'react';
import { Download, Layers, ArrowRight, ArrowRightLeft, FileText, ExternalLink } from 'lucide-react';
import { ProcessedImage } from '../types';
import { Button } from './Button';

interface ComparisonViewProps {
  originalImage: ProcessedImage;
  generatedImage: ProcessedImage;
  onContinueEditing?: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ 
  originalImage, 
  generatedImage,
  onContinueEditing 
}) => {
  const [activeTab, setActiveTab] = useState<'compare' | 'result'>('result');

  const isPdf = originalImage.mimeType === 'application/pdf';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImage.dataUri;
    link.download = `gemini-edit-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-black rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-3 md:p-4 border-b border-zinc-800 bg-black/50 backdrop-blur-md gap-3 md:gap-4">
        <div className="flex space-x-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('result')}
            className={`px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${
              activeTab === 'result' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Final Result
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all flex items-center gap-1 md:gap-2 ${
              activeTab === 'compare' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <ArrowRightLeft size={12} />
            <span className="hidden sm:inline">Side-by-Side</span>
            <span className="sm:hidden">Compare</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3">
           {onContinueEditing && (
             <Button 
               variant="secondary" 
               size="sm" 
               onClick={onContinueEditing} 
               icon={<Layers size={14} />}
               title="Edit Output"
               className="!text-xs !px-2 md:!px-4"
             >
               <span className="hidden sm:inline">Edit Output</span>
             </Button>
           )}
           <Button variant="primary" size="sm" onClick={handleDownload} icon={<Download size={14} />} className="!text-xs !px-3 md:!px-4">
             <span className="hidden sm:inline">Download</span>
           </Button>
        </div>
      </div>

      {/* Image Display Area */}
      <div className="relative flex-1 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black overflow-auto p-4 md:p-6 flex items-center justify-center">
        {activeTab === 'result' ? (
          <div className="relative group w-full h-full flex items-center justify-center min-h-[300px]">
            <img
              src={generatedImage.dataUri}
              alt="AI Generated Result"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl shadow-black border border-zinc-800"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full h-full min-h-[500px] md:min-h-0">
             {/* Original */}
             <div className="flex flex-col items-center justify-center relative bg-black rounded-xl border border-zinc-800 p-2 md:p-4 h-full">
                <span className="absolute top-4 left-4 px-3 py-1 bg-zinc-900/90 backdrop-blur-md rounded-lg text-[10px] text-zinc-400 uppercase tracking-wider font-bold z-10 border border-zinc-700 flex items-center gap-2">
                  {isPdf ? <FileText size={10} /> : null} Original
                </span>
                
                {isPdf ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <object data={originalImage.dataUri} type="application/pdf" className="w-full h-full rounded-lg shadow-inner min-h-[250px] opacity-80">
                        <div className="flex flex-col items-center text-zinc-500">
                          <FileText size={48} className="mb-2" />
                          <p>PDF Preview Unavailable</p>
                          <a href={originalImage.dataUri} target="_blank" rel="noreferrer" className="text-white text-xs mt-2 hover:underline flex items-center gap-1">
                            Open PDF <ExternalLink size={10} />
                          </a>
                        </div>
                    </object>
                  </div>
                ) : (
                  <img
                    src={originalImage.dataUri}
                    alt="Original"
                    className="max-w-full max-h-full object-contain rounded-lg opacity-80"
                  />
                )}
             </div>
             
             {/* Arrow indicator for desktop */}
             <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none z-20">
                <div className="bg-black p-2 rounded-full border border-zinc-700 text-white shadow-xl shadow-white/10">
                   <ArrowRight size={20} className="text-white" />
                </div>
             </div>

             {/* Result */}
             <div className="flex flex-col items-center justify-center relative bg-black rounded-xl border border-white/20 p-2 md:p-4 h-full shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <span className="absolute top-4 left-4 px-3 py-1 bg-white text-black backdrop-blur-md rounded-lg text-[10px] uppercase tracking-wider font-bold z-10 shadow-lg shadow-white/30">
                  Edited
                </span>
                <img
                  src={generatedImage.dataUri}
                  alt="Edited"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                />
             </div>
          </div>
        )}
      </div>
    </div>
  );
};