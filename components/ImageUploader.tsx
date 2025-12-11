import React, { useRef, useState } from 'react';
import { Upload, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  compact?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, compact = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    // Validate type (Image or PDF)
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError("Please upload a valid image or PDF file.");
      return;
    }
    // Validate size (max 10MB for PDFs/Images)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size too large. Please upload a file under 10MB.");
      return;
    }
    setError(null);
    onImageSelected(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  if (compact) {
    return (
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-black hover:bg-zinc-900 text-zinc-300 rounded-lg transition-colors border border-zinc-800 hover:border-white text-sm font-medium w-full group"
      >
        <Upload size={16} className="group-hover:text-white transition-colors" />
        <span className="group-hover:text-white transition-colors">Upload New Image/PDF</span>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,application/pdf"
          onChange={handleChange}
        />
      </button>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <div
        className={`relative border border-dashed rounded-3xl p-6 md:p-12 text-center transition-all duration-500 cursor-pointer group overflow-hidden
          ${isDragging 
            ? 'border-white bg-zinc-900 scale-[1.01] shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
            : 'border-zinc-800 bg-black hover:border-zinc-600 hover:bg-zinc-900/50'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,application/pdf"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center relative z-10">
          <div className={`p-5 rounded-2xl mb-6 transition-all duration-500 shadow-xl border ${
            isDragging 
              ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-110' 
              : 'bg-black text-white border-zinc-800 group-hover:border-white/50 group-hover:bg-zinc-900 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]'
          }`}>
             {isDragging ? <Upload size={32} /> : <ImageIcon size={32} className="md:w-10 md:h-10" />}
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-white transition-colors">
            Upload Image or PDF
          </h3>
          <p className="text-zinc-500 text-sm md:text-base max-w-sm mx-auto leading-relaxed mb-6 group-hover:text-zinc-400">
            Drag and drop to start editing. <br/>
            <span className="text-zinc-600 text-xs md:text-sm group-hover:text-white/70 transition-colors">Supports PNG, JPG, WebP & PDF up to 10MB</span>
          </p>

          <div className="flex gap-3">
             <span className="px-3 py-1 bg-zinc-950 rounded-full text-[10px] md:text-xs font-medium text-zinc-500 border border-zinc-800 group-hover:border-white/30 group-hover:text-white transition-colors">
                Drag & Drop
             </span>
             <span className="px-3 py-1 bg-zinc-950 rounded-full text-[10px] md:text-xs font-medium text-zinc-500 border border-zinc-800 group-hover:border-white/30 group-hover:text-white transition-colors">
                Browse Files
             </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-zinc-900 border border-red-900 rounded-xl flex items-center text-red-200 text-sm animate-fade-in backdrop-blur-sm shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <AlertCircle size={18} className="mr-3 flex-shrink-0 text-red-500" />
          {error}
        </div>
      )}
    </div>
  );
};