
import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Image as ImageIcon, RotateCcw, X, Wand2, Info, Undo, Redo, FileText, ChevronRight, Layout, History, Menu } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { ImageUploader } from './components/ImageUploader';
import { ComparisonView } from './components/ComparisonView';
import { Button } from './components/Button';
import { PromptInput } from './components/PromptInput';
import { AboutPage } from './components/AboutPage';
import { editImageWithGemini, generatePromptSuggestions } from './services/geminiService';
import { ProcessedImage, AppState, SUGGESTED_PROMPTS } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  
  // History Management
  const [history, setHistory] = useState<ProcessedImage[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  
  const [generatedImage, setGeneratedImage] = useState<ProcessedImage | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Suggestions State
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(SUGGESTED_PROMPTS);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Derived state
  const originalImage = historyIndex >= 0 ? history[historyIndex] : null;
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  const isPdf = originalImage?.mimeType === 'application/pdf';

  // Handlers
  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        const id = uuidv4();
        const newImage = {
          id,
          dataUri: e.target.result,
          mimeType: file.type,
          timestamp: Date.now()
        };
        
        // Reset history with new upload
        setHistory([newImage]);
        setHistoryIndex(0);
        setGeneratedImage(null);
        setAppState(AppState.EDITING);
        setError(null);
        setIsSidebarOpen(false); // Close sidebar on mobile after selection
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setHistory([]);
    setHistoryIndex(-1);
    setGeneratedImage(null);
    setPrompt('');
    setAppState(AppState.IDLE);
    setError(null);
    setSuggestedPrompts(SUGGESTED_PROMPTS);
    setIsSidebarOpen(false);
  };

  const handleUndo = useCallback(() => {
    if (canUndo) {
      setHistoryIndex(prev => prev - 1);
      setGeneratedImage(null); 
    }
  }, [canUndo]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      setHistoryIndex(prev => prev + 1);
      setGeneratedImage(null);
    }
  }, [canRedo]);

  // Fetch AI suggestions when the original image changes
  useEffect(() => {
    let isMounted = true;

    const fetchSuggestions = async () => {
      if (!originalImage) return;

      setIsLoadingSuggestions(true);
      try {
        const newSuggestions = await generatePromptSuggestions(originalImage.dataUri, originalImage.mimeType);
        if (isMounted && newSuggestions.length > 0) {
          setSuggestedPrompts(newSuggestions);
        }
      } catch (err) {
        console.error("Error fetching suggestions", err);
        // Keep defaults on error
      } finally {
        if (isMounted) setIsLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (originalImage) {
        fetchSuggestions();
      }
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [originalImage?.id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputFocused = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName);
      if (isInputFocused) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const handleContinueEditing = () => {
    if (generatedImage) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(generatedImage);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setGeneratedImage(null);
      setPrompt(''); 
      setAppState(AppState.EDITING);
    }
  };

  const handleGenerate = async () => {
    if (!originalImage) {
      setError("Please upload an image or PDF to edit.");
      return;
    }
    if (!prompt.trim()) {
        setError("Please enter an instruction.");
        return;
    }

    setAppState(AppState.PROCESSING);
    setError(null);

    try {
      const generatedDataUri = await editImageWithGemini(
        originalImage.dataUri,
        originalImage.mimeType,
        prompt
      );

      const mimeMatch = generatedDataUri.match(/data:([^;]+);/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

      setGeneratedImage({
        id: uuidv4(),
        dataUri: generatedDataUri,
        mimeType: mimeType,
        timestamp: Date.now()
      });
      setAppState(AppState.VIEWING);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to generate image");
      setAppState(AppState.EDITING);
    }
  };

  // ----------------------------------------------------------------------
  // VIEW: Main App
  // ----------------------------------------------------------------------
  return (
    <div className="h-screen bg-black text-white flex overflow-hidden font-sans selection:bg-white/30 selection:text-white">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-black border-r border-zinc-800 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800 bg-black">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleReset}>
            <div className="p-1.5 bg-white rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform group-hover:scale-105">
              <Wand2 className="text-black" size={18} />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white group-hover:text-zinc-300 transition-colors">
              Gemini Editor
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowAbout(true)}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
              title="About"
            >
              <Info size={18} />
            </button>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
           {/* Current Image Info */}
           {originalImage ? (
             <div className="bg-zinc-900/30 rounded-xl p-3 border border-zinc-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                    <History size={12} /> Edit History
                  </h3>
                  <div className="flex items-center gap-1">
                    <button onClick={handleUndo} disabled={!canUndo} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 disabled:opacity-30 transition-colors"><Undo size={14}/></button>
                    <button onClick={handleRedo} disabled={!canRedo} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 disabled:opacity-30 transition-colors"><Redo size={14}/></button>
                  </div>
                </div>
                
                {/* Thumbnails of history */}
                <div className="space-y-2">
                   {history.map((item, idx) => (
                     <div 
                       key={item.id}
                       onClick={() => {
                          setHistoryIndex(idx);
                          setGeneratedImage(null);
                          if (window.innerWidth < 768) setIsSidebarOpen(false);
                       }}
                       className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                         idx === historyIndex ? 'bg-zinc-800 border border-white/40 shadow-inner' : 'hover:bg-zinc-900 border border-transparent'
                       }`}
                     >
                        <div className={`w-10 h-10 rounded bg-black flex-shrink-0 overflow-hidden border ${idx === historyIndex ? 'border-white' : 'border-zinc-800'}`}>
                           {item.mimeType === 'application/pdf' ? (
                             <div className="w-full h-full flex items-center justify-center text-zinc-500"><FileText size={16} /></div>
                           ) : (
                             <img src={item.dataUri} className="w-full h-full object-cover opacity-80" alt="" />
                           )}
                        </div>
                        <div className="min-w-0">
                           <p className={`text-xs font-medium truncate ${idx === historyIndex ? 'text-white' : 'text-zinc-500'}`}>
                             {idx === 0 ? "Original Upload" : `Edit #${idx}`}
                           </p>
                           <p className="text-[10px] text-zinc-600 truncate">{new Date(item.timestamp).toLocaleTimeString()}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <Button variant="secondary" size="sm" className="w-full text-xs" onClick={handleReset} icon={<RotateCcw size={12} />}>
                    New Project
                  </Button>
                </div>
             </div>
           ) : (
             <div className="text-center py-8 px-4 bg-zinc-900/20 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-700 transition-colors">
               <ImageIcon size={32} className="mx-auto text-zinc-700 mb-3" />
               <p className="text-sm text-zinc-500 font-medium">No Image Selected</p>
               <p className="text-xs text-zinc-700 mt-1">Upload an image to start tracking your edit history.</p>
             </div>
           )}

           {/* Suggestions */}
           <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                 <Sparkles size={14} className="text-white" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Inspiration</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                  {suggestedPrompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setPrompt(p);
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                      }}
                      className="text-left text-xs p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-transparent hover:border-zinc-700 transition-all truncate group"
                    >
                      <span className="opacity-50 group-hover:opacity-100 transition-opacity mr-2 text-white">✨</span>
                      {p}
                    </button>
                  ))}
              </div>
           </div>
        </div>
        
        {/* Footer info */}
        <div className="p-4 border-t border-zinc-800 text-[10px] text-zinc-600 flex justify-between bg-black">
          <span>Gemini 2.5 Flash Image</span>
          <span className="opacity-50">v2.1</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative bg-black w-full transition-all">
         {/* Subtle ambient light */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black pointer-events-none" />

         {/* Top Info Bar */}
         <header className="h-16 flex items-center justify-between px-4 md:px-8 z-10 bg-black/50 backdrop-blur-md sticky top-0 md:relative border-b border-zinc-800 md:border-none">
            <div className="flex items-center gap-3">
               <button 
                 onClick={() => setIsSidebarOpen(true)}
                 className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
               >
                 <Menu size={20} />
               </button>
               <h2 className="text-lg font-medium text-white truncate tracking-tight">
                  {originalImage 
                      ? (generatedImage ? 'Comparison' : 'Edit Mode') 
                      : 'Dashboard'}
               </h2>
            </div>
            <div className="flex items-center gap-4">
              {originalImage && (
                 <span className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 hidden sm:inline-block font-mono">
                    {originalImage.mimeType.split('/')[1].toUpperCase()} • {(originalImage.dataUri.length * 0.75 / 1024).toFixed(0)} KB
                 </span>
              )}
            </div>
         </header>

         {/* Canvas */}
         <div className="flex-1 overflow-y-auto md:overflow-hidden relative p-2 md:p-4 pb-24 md:pb-32 z-10">
            {error && (
               <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[90%] md:w-auto">
                 <div className="bg-zinc-900/90 backdrop-blur-md border border-red-900/50 text-red-200 px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(255,0,0,0.1)] flex items-center gap-3 text-sm md:text-base">
                   <X size={16} className="flex-shrink-0" /> <span className="flex-1">{error}</span>
                   <button onClick={() => setError(null)} className="ml-2 hover:bg-red-900/30 p-1 rounded-full"><X size={12}/></button>
                 </div>
               </div>
            )}

            {originalImage ? (
               generatedImage ? (
                  <ComparisonView 
                    originalImage={originalImage} 
                    generatedImage={generatedImage}
                    onContinueEditing={handleContinueEditing}
                  />
               ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in min-h-[400px]">
                     <div className="relative max-w-4xl w-full h-full max-h-[60vh] md:max-h-[70vh] aspect-video bg-black rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
                         {isPdf ? (
                           <object data={originalImage.dataUri} type="application/pdf" className="w-full h-full opacity-80">
                              <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                                <FileText size={64} className="mb-4 text-zinc-700" />
                                <p>PDF Preview</p>
                              </div>
                           </object>
                         ) : (
                           <img src={originalImage.dataUri} className="w-full h-full object-contain opacity-90" alt="Work in progress" />
                         )}
                         
                         {appState === AppState.PROCESSING && (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                               <div className="relative w-24 h-24 md:w-32 md:h-32">
                                  <div className="absolute inset-0 border-t-2 border-white rounded-full animate-spin shadow-[0_0_30px_rgba(255,255,255,0.3)]"></div>
                                  <div className="absolute inset-4 border-t-2 border-zinc-500 rounded-full animate-spin" style={{animationDirection: 'reverse'}}></div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                     <Sparkles className="text-white animate-pulse" size={32} />
                                  </div>
                               </div>
                               <h3 className="mt-8 text-xl md:text-2xl font-light text-white tracking-[0.2em] uppercase">Processing</h3>
                               <p className="text-zinc-400 mt-2 text-xs md:text-sm font-mono">Gemini is rewriting pixels...</p>
                            </div>
                         )}
                     </div>
                  </div>
               )
            ) : (
               <div className="h-full flex flex-col items-center justify-center -mt-10 px-4">
                  <div className="text-center mb-6 md:mb-10 animate-fade-in-up">
                     <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4 tracking-tighter">
                       What will you <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">create</span>?
                     </h2>
                     <p className="text-zinc-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                        Start by typing a prompt below, then upload an image to see the magic happen.
                     </p>
                  </div>
                  <ImageUploader onImageSelected={handleImageSelect} />
               </div>
            )}
         </div>

         {/* Floating Prompt Bar */}
         <div className="absolute bottom-4 md:bottom-8 left-0 right-0 px-2 md:px-4 flex justify-center z-30 pointer-events-none">
            <div className="w-full max-w-3xl pointer-events-auto">
               <div className="bg-black/80 backdrop-blur-2xl border border-zinc-800 p-2 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                  <PromptInput 
                      value={prompt}
                      onChange={setPrompt}
                      onSubmit={handleGenerate}
                      onClear={() => setPrompt('')}
                      isLoading={appState === AppState.PROCESSING}
                      disabled={appState === AppState.PROCESSING}
                  />
                  {!originalImage && prompt.length > 5 && (
                     <div className="absolute -top-14 left-0 right-0 flex justify-center animate-fade-in-up">
                        <div className="bg-white text-black px-4 py-2 rounded-full text-xs md:text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 whitespace-nowrap border border-zinc-200">
                           <Layout size={14} /> Now upload an image to apply this edit!
                           <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-zinc-200"></div>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>

      </main>

      {/* About Page Modal */}
      {showAbout && <AboutPage onClose={() => setShowAbout(false)} />}
    </div>
  );
}

export default App;
