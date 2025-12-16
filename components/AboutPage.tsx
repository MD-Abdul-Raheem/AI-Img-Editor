import React from 'react';
import { X, Wand2, Sparkles, Image as ImageIcon, Layers, History, Zap, Shield, Globe } from 'lucide-react';
import { Button } from './Button';

interface AboutPageProps {
  onClose: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] overflow-y-auto">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 sticky top-0 bg-black/80 backdrop-blur-md py-4 z-10 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                <Wand2 className="text-black" size={24} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">About Gemini Editor</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} icon={<X size={20} />} />
          </div>

          {/* Content */}
          <div className="space-y-8 pb-8">
            {/* Overview */}
            <section className="bg-zinc-900/30 rounded-2xl p-6 md:p-8 border border-zinc-800">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={24} className="text-white" />
                What is Gemini Editor?
              </h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Gemini Editor is a powerful AI-powered image editing application that leverages Google's Gemini 2.5 Flash Image model to transform your images with simple text instructions. Whether you're a professional designer, photographer, or casual user, Gemini Editor makes complex image editing accessible through natural language.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                Simply upload an image or PDF, describe what you want to change, and watch as AI brings your vision to life in seconds.
              </p>
            </section>

            {/* Key Features */}
            <section className="bg-zinc-900/30 rounded-2xl p-6 md:p-8 border border-zinc-800">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FeatureCard 
                  icon={<Wand2 size={20} />}
                  title="AI-Powered Editing"
                  description="Use natural language to edit images. No complex tools or technical skills required."
                />
                <FeatureCard 
                  icon={<History size={20} />}
                  title="Edit History"
                  description="Track all your edits with visual history. Undo/redo anytime with keyboard shortcuts (Ctrl+Z/Y)."
                />
                <FeatureCard 
                  icon={<Layers size={20} />}
                  title="Iterative Editing"
                  description="Continue editing your results. Apply multiple transformations in sequence."
                />
                <FeatureCard 
                  icon={<ImageIcon size={20} />}
                  title="Side-by-Side Comparison"
                  description="Compare original and edited images instantly to see the transformation."
                />
                <FeatureCard 
                  icon={<Sparkles size={20} />}
                  title="Smart Suggestions"
                  description="Get AI-generated prompt suggestions tailored to your specific image content."
                />
                <FeatureCard 
                  icon={<Zap size={20} />}
                  title="Fast Processing"
                  description="Powered by Gemini 2.5 Flash for lightning-fast image generation."
                />
              </div>
            </section>

            {/* How It Works */}
            <section className="bg-zinc-900/30 rounded-2xl p-6 md:p-8 border border-zinc-800">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6">How It Works</h2>
              <div className="space-y-4">
                <Step number={1} title="Upload Your Image" description="Drag and drop or browse to upload an image (PNG, JPG, WebP) or PDF file up to 10MB." />
                <Step number={2} title="Describe Your Edit" description="Type what you want to change in natural language. Be specific for best results." />
                <Step number={3} title="Generate & Compare" description="AI processes your request and shows before/after comparison. Download or continue editing." />
                <Step number={4} title="Iterate & Refine" description="Apply the edit and continue with more transformations to perfect your image." />
              </div>
            </section>

            {/* Supported Formats */}
            <section className="bg-zinc-900/30 rounded-2xl p-6 md:p-8 border border-zinc-800">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Supported Formats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <FormatBadge format="PNG" />
                <FormatBadge format="JPG/JPEG" />
                <FormatBadge format="WebP" />
                <FormatBadge format="PDF" />
              </div>
              <p className="text-zinc-400 text-sm mt-4">Maximum file size: 10MB</p>
            </section>

            {/* Technology Stack */}
            <section className="bg-zinc-900/30 rounded-2xl p-6 md:p-8 border border-zinc-800">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Technology Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TechItem label="AI Model" value="Google Gemini 2.5 Flash Image" />
                <TechItem label="Framework" value="React 19 + TypeScript" />
                <TechItem label="Styling" value="Tailwind CSS" />
                <TechItem label="Build Tool" value="Vite" />
                <TechItem label="Icons" value="Lucide React" />
                <TechItem label="API" value="Google GenAI SDK" />
              </div>
            </section>

            {/* Tips & Best Practices */}
            <section className="bg-zinc-900/30 rounded-2xl p-6 md:p-8 border border-zinc-800">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Tips for Best Results</h2>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1">✨</span>
                  <span><strong className="text-white">Be Specific:</strong> Detailed prompts yield better results. Instead of "make it better," try "enhance lighting with warm tones and increase contrast."</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1">✨</span>
                  <span><strong className="text-white">Use Professional Terms:</strong> Terms like "bokeh," "color grading," "studio lighting" help the AI understand your intent.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1">✨</span>
                  <span><strong className="text-white">Iterate:</strong> Start with broad changes, then refine with specific adjustments in subsequent edits.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1">✨</span>
                  <span><strong className="text-white">Try Suggestions:</strong> Use AI-generated suggestions as inspiration or starting points.</span>
                </li>
              </ul>
            </section>

            {/* Keyboard Shortcuts */}
            <section className="bg-zinc-900/30 rounded-2xl p-6 md:p-8 border border-zinc-800">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Keyboard Shortcuts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Shortcut keys="Ctrl/Cmd + Z" action="Undo last edit" />
                <Shortcut keys="Ctrl/Cmd + Shift + Z" action="Redo edit" />
                <Shortcut keys="Ctrl/Cmd + Y" action="Redo edit (alternative)" />
                <Shortcut keys="Enter" action="Generate edit (when prompt focused)" />
              </div>
            </section>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-zinc-800">
              <p className="text-zinc-500 text-sm">
                Powered by Google Gemini 2.5 Flash Image • Version 2.1
              </p>
              <p className="text-zinc-600 text-xs mt-2">
                Built with React, TypeScript, and Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-black/50 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-colors">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-zinc-900 rounded-lg text-white border border-zinc-800">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const Step: React.FC<{ number: number; title: string; description: string }> = ({ number, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(255,255,255,0.3)]">
      {number}
    </div>
    <div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

const FormatBadge: React.FC<{ format: string }> = ({ format }) => (
  <div className="bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 text-center">
    <span className="text-white font-semibold text-sm">{format}</span>
  </div>
);

const TechItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
    <span className="text-zinc-400 text-sm">{label}</span>
    <span className="text-white font-medium text-sm">{value}</span>
  </div>
);

const Shortcut: React.FC<{ keys: string; action: string }> = ({ keys, action }) => (
  <div className="flex items-center justify-between bg-black/50 rounded-lg px-4 py-3 border border-zinc-800">
    <span className="text-zinc-400 text-sm">{action}</span>
    <kbd className="bg-zinc-900 text-white px-3 py-1 rounded text-xs font-mono border border-zinc-700">{keys}</kbd>
  </div>
);
