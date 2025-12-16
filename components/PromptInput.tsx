import React, { useRef, useEffect } from 'react';
import { Send, X, Sparkles } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  onSubmit,
  onClear,
  isLoading,
  disabled
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading && !disabled) {
        onSubmit();
      }
    }
  };

  return (
    <div className="relative group w-full">
      <div className={`
        relative flex items-end gap-2 p-3 rounded-2xl border transition-all duration-300 shadow-xl
        ${disabled 
          ? 'bg-zinc-900/50 border-zinc-800 opacity-60 cursor-not-allowed' 
          : 'bg-black border-zinc-800 focus-within:border-white/60 focus-within:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:border-zinc-600'
        }
      `}>
        <div className="flex-1 min-h-[48px] relative flex items-center">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Describe your edit (e.g., 'Make it look like a sketch', 'Add a hat')..."
            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-zinc-500 resize-none py-2 px-2 max-h-[160px] overflow-y-auto leading-relaxed"
            rows={1}
            style={{ height: 'auto', minHeight: '24px' }}
          />
        </div>
        
        <div className="flex items-center gap-1 pb-1">
           {value && !isLoading && (
            <button 
              onClick={onClear}
              className="p-2 text-zinc-500 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
              title="Clear prompt"
              type="button"
            >
              <X size={16} />
            </button>
           )}
           <button
             onClick={onSubmit}
             disabled={!value.trim() || isLoading || disabled}
             className={`
               p-3 rounded-xl transition-all duration-300 flex items-center justify-center
               ${!value.trim() || isLoading || disabled 
                 ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                 : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] transform active:scale-95'
               }
             `}
             title="Generate Edit"
             type="button"
           >
             {isLoading ? <Sparkles className="animate-spin text-black" size={18} /> : <Send size={18} strokeWidth={2.5} />}
           </button>
        </div>
      </div>
      <div className="flex justify-between mt-2 px-2">
         <span className="text-[10px] text-zinc-500 font-medium transition-opacity opacity-0 group-focus-within:opacity-100 uppercase tracking-widest">
          Press Enter to generate
         </span>
         {value.length > 0 && (
            <span className="text-[10px] text-white font-medium font-mono">
              {value.length} chars
            </span>
         )}
      </div>
    </div>
  );
};